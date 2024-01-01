import fs from "fs";
import path from "path";
import { JSONParser } from "./json-parser";

const test = `{
  "key": "value",
  "key2": "value"
}`;

const parser = new JSONParser(test);

console.log(parser.parse());

// const dir = path.join(__dirname, "__tests__/step2/");
// const files = fs.readdirSync(dir);

// files.forEach((file: string) => {
//   if (file.endsWith(".json")) {
//     const input = fs.readFileSync(`${dir}${file}`, "utf8").toString();
//     console.log(input);
//     let exitCode = 0;
//     try {
//       JSON.parse(input);
//     } catch (err) {
//       exitCode = 1;
//     }
//   }
// });
