export type ExcludedProperty =
  | "constructor"
  | "call"
  | "apply"
  | "bind"
  | "arguments"
  | "caller"
  | "callee";

export const isExcludedProperty = (
  propName: string
): propName is ExcludedProperty => {
  switch (propName) {
    case "constructor":
    case "call":
    case "apply":
    case "bind":
    case "arguments":
    case "caller":
    case "callee":
      return true;

    default:
      return false;
  }
};
