# Challenge 2 - Write your own JSON parser

This challenge corresponds to the second part of the Coding Challenges series by John Crickett https://codingchallenges.fyi/challenges/challenge-json-parser.

## Description

The JSON parser is written in `json-parser.ts`. The tool is used to parse a given string and returns the equivalent object representation of the string in TypeScript.

## Usage

You can directly import the tool into any TypeScript file as follows:

```ts
import { JSONParser } from "./json-parser.ts";

const output = new JSONParser(input).parse();
```

## Run tests

To run the tests for the JSON parser tool, go to the root directory of this repository and run the following command:

```bash
npm test
```
