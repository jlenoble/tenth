// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const isEnumerable = (obj: any): boolean => {
  const type = typeof obj;
  if (type === "string" || obj instanceof String) {
    return false;
  }
  return (
    type === "object" &&
    obj !== null &&
    (obj.length > 0 || Object.keys(obj).length > 0)
  );
};
