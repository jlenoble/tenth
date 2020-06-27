type ExcludedName =
  | "constructor"
  | "call"
  | "apply"
  | "bind"
  | "caller"
  | "arguments";

export const isExcludedProperty = (
  methodName: string
): methodName is ExcludedName => {
  switch (methodName) {
    case "constructor":
    case "call":
    case "apply":
    case "bind":
    case "caller":
    case "arguments":
      return true;

    default:
      return false;
  }
};
