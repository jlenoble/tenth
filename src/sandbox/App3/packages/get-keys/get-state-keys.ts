import {
  isExcludedProperty,
  extendIsExcludedProperty,
} from "./is-excluded-property";

export const getStateKeys = <T extends Record<string, unknown>>(
  obj: T,
  isExcludedKey: (key: string) => boolean = isExcludedProperty
): string[] => {
  isExcludedKey = extendIsExcludedProperty(isExcludedKey);

  return Object.entries(Object.getOwnPropertyDescriptors(obj))
    .filter(([key, descriptor]) => {
      return (
        !isExcludedKey(key) &&
        !descriptor.enumerable &&
        typeof obj[key] !== "function"
      );
    })
    .map(([key]) => key);
};
