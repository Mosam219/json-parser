import { NumberToken, Tokens } from "./token";
import { JSONObject, JSONValue } from "./types";

const FAILURE_EXIT_CODE = 1;
const SUCCESS_EXIT_CODE = 0;

export class JSONParser {
  private input: string;
  private pos: number;
  constructor(__input: string) {
    this.pos = 0;
    this.input = __input;
  }

  parse() {
    this.consumeWhiteSpace();
    const value = this.parseValue();

    console.log("Parsed successfully %s", value);
    process.exit(SUCCESS_EXIT_CODE);
  }

  private parseValue(): JSONValue {
    switch (this.currentToken()) {
      case Tokens.BEGIN_OBJECT:
        return this.parseObject();
      case Tokens.QUOTE:
        return this.parseString();
      case Tokens.BEGIN_ARRAY:
        return this.parseArray();
      case Tokens.BEGIN_TRUE:
        return this.parseTrue();
      case Tokens.BEGIN_FALSE:
        return this.parseFalse();
      case Tokens.BEGIN_NULL:
        return this.parseNull();
      case NumberToken.ONE:
      case NumberToken.TWO:
      case NumberToken.THREE:
      case NumberToken.FOUR:
      case NumberToken.FIVE:
      case NumberToken.SIX:
      case NumberToken.SEVEN:
      case NumberToken.EIGHT:
      case NumberToken.NINE:
      case NumberToken.MINUS:
      case NumberToken.ZERO:
        return this.parseNumber();
      default: {
        console.log(
          `Unexpected token ${this.currentToken()} at position ${this.pos}`
        );
        process.exit(FAILURE_EXIT_CODE);
      }
    }
  }

  parseNumber() {
    let str = "";
    if (this.currentToken() === NumberToken.MINUS) {
      str += NumberToken.MINUS;
      this.consumeToken(NumberToken.MINUS);
    }

    str += this.parseDigits();

    if (
      this.currentToken() === NumberToken.SMALL_EXPONENT ||
      this.currentToken() === NumberToken.CAPITAL_EXPONENT
    ) {
      str += this.currentToken();
      this.consumeToken();
      if (
        this.currentToken() == NumberToken.PLUS ||
        this.currentToken() == NumberToken.MINUS
      ) {
        str += this.currentToken();
        this.consumeToken();
      }
      str += this.parseDigits();
    } else if (this.currentToken() === NumberToken.DOT) {
      str += this.currentToken();
      this.consumeToken(NumberToken.DOT);
      str += this.parseDigits();
    }
    return str;
  }

  parseDigits() {
    let str = "";
    if (
      this.currentToken() >= NumberToken.ZERO &&
      this.currentToken() <= NumberToken.NINE
    ) {
      while (
        this.currentToken() >= NumberToken.ZERO &&
        this.currentToken() <= NumberToken.NINE
      ) {
        str += this.currentToken();
        this.consumeToken();
      }
    } else {
      console.log(
        `Invalid character ${this.currentToken()} at position ${this.pos}\n
        parsed ${str} till now`
      );
      process.exit(FAILURE_EXIT_CODE);
    }
    return str;
  }

  parseTrue(): JSONValue {
    this.consumeToken("t");
    this.consumeToken("r");
    this.consumeToken("u");
    this.consumeToken("e");
    return true;
  }

  parseFalse(): JSONValue {
    this.consumeToken("f");
    this.consumeToken("a");
    this.consumeToken("l");
    this.consumeToken("s");
    this.consumeToken("e");
    return true;
  }

  parseNull(): JSONValue {
    this.consumeToken("n");
    this.consumeToken("u");
    this.consumeToken("l");
    this.consumeToken("l");
    return null;
  }

  parseArray(): JSONValue {
    this.consumeToken(Tokens.BEGIN_ARRAY);
    let arr = [];
    while (this.currentToken() !== Tokens.END_ARRAY) {
      const obj = this.parseValue();
      arr.push(obj);

      if (this.currentToken() === Tokens.COMMA) {
        this.consumeToken(Tokens.COMMA);
      } else break;
    }
    this.consumeToken(Tokens.END_ARRAY);
    return arr;
  }

  parseObject() {
    this.consumeToken(Tokens.BEGIN_OBJECT);
    const obj: JSONObject = {};
    let morePairs = false;
    while (this.currentToken() !== Tokens.END_OBJECT || morePairs) {
      const parsedValue = this.parsePairs();
      obj[parsedValue.key] = parsedValue.value;

      if (this.currentToken() === Tokens.COMMA) {
        this.consumeToken(Tokens.COMMA);
        morePairs = true;
      } else if (this.currentToken() !== Tokens.END_OBJECT) {
        morePairs = false;
        console.log("Invalid Object");
        process.exit(FAILURE_EXIT_CODE);
      } else {
        morePairs = false;
      }
    }
    this.consumeToken(Tokens.END_OBJECT);
    return obj;
  }

  parsePairs(): { key: string; value: JSONValue } {
    const key: string = this.parseString();
    this.consumeToken(Tokens.SEMI_COLON);
    const value: JSONValue = this.parseValue();
    return { key, value };
  }

  parseString(): string {
    let str = "";
    this.consumeToken(Tokens.QUOTE);
    while (this.currentToken() !== Tokens.QUOTE) {
      str += this.currentToken();
      this.pos++;
    }
    this.consumeToken(Tokens.QUOTE);
    return str;
  }

  consumeToken(expectedToken?: string) {
    if (expectedToken && this.currentToken() !== expectedToken) {
      console.log(
        `Token is not matching with expected token at ${
          this.pos
        } \n expected token ${expectedToken} and current token ${this.currentToken()}`
      );
      process.exit(FAILURE_EXIT_CODE);
    }
    this.pos++;
    while (
      this.currentToken() === " " ||
      this.currentToken() === "\t" ||
      this.currentToken() === "\n" ||
      this.currentToken() === "\r"
    )
      this.pos++;
  }

  consumeWhiteSpace() {
    while (true) {
      if (this.pos < this.input.length && this.input[this.pos] == " ")
        this.pos++;
      else break;
    }
  }

  currentToken() {
    return this.input[this.pos];
  }
}
