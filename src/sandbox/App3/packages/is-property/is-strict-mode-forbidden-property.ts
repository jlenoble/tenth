export type StrictModeForbiddenProperty = "arguments" | "caller" | "callee";

export const isStrictModeForbiddenProperty = (
  propName: string
): propName is StrictModeForbiddenProperty => {
  switch (propName) {
    case "arguments":
    case "caller":
    case "callee":
      return true;

    default:
      return false;
  }
};
