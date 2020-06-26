export const getStates = <T extends Record<string, unknown>>(
  obj: T
): string[] => {
  return Object.entries(Object.getOwnPropertyDescriptors(obj))
    .filter(([key, descriptor]) => {
      return !descriptor.enumerable && typeof obj[key] !== "function";
    })
    .map(([key]) => key);
};
