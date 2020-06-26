export const getAttributes = <T extends Record<string, unknown>>(
  obj: T
): string[] => {
  return Object.keys(obj).filter((key) => {
    return typeof obj[key] !== "function";
  });
};
