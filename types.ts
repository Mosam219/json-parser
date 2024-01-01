export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONValue =
  | string
  | number
  | boolean
  | object
  | null
  | Array<JSONObject>
  | JSONObject;
