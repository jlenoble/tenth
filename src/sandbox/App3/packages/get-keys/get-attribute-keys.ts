import {
  isExcludedProperty,
  extendIsExcludedProperty,
} from "./is-excluded-property";

export const getAttributeKeys = <T extends Record<string, unknown>>(
  obj: T,
  isExcludedKey: (key: string) => boolean = isExcludedProperty
): string[] => {
  isExcludedKey = extendIsExcludedProperty(isExcludedKey);

  return Object.keys(obj).filter((key) => {
    return !isExcludedKey(key) && typeof obj[key] !== "function";
  });
};
