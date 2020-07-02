export const isAccessor = <T extends Record<string, unknown>>(
  obj: T,
  key: string
): boolean => {
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);

  return (
    descriptor !== undefined &&
    (typeof descriptor.get === "function" ||
      typeof descriptor.set === "function")
  );
};
