export type KeyType =
  | "attributes"
  | "states"
  | "methods"
  | "allMethods"
  | "properties"
  | "all"
  | "getOwnPropertyNames";

export interface AnyObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}
