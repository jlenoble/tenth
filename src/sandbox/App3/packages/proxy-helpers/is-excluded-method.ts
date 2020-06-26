type ExcludedMethodName = "constructor" | "call" | "apply" | "bind";

export const isExcludedMethod = (
  methodName: string
): methodName is ExcludedMethodName => {
  switch (methodName) {
    case "constructor":
    case "call":
    case "apply":
    case "bind":
      return true;

    default:
      return false;
  }
};
