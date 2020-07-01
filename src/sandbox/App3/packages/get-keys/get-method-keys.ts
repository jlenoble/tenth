import {
  isExcludedProperty,
  extendIsExcludedProperty,
} from "./is-excluded-property";

export const getMethodKeys = <T extends Record<string, unknown>>(
  obj: T,
  {
    lastConstructor = Object,
    includeLastConstructor = false,
    includeNonEnumerable = false,
    isExcludedKey = isExcludedProperty,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastConstructor?: any;
    includeLastConstructor?: boolean;
    includeNonEnumerable?: boolean;
    isExcludedKey?: (key: string) => boolean;
  } = {}
): string[] => {
  const instanceMethods = new Set<string>();
  isExcludedKey = extendIsExcludedProperty(isExcludedKey);

  Object.entries(Object.getOwnPropertyDescriptors(obj))
    .filter(([key, descriptor]) => {
      if (!descriptor.enumerable && !includeNonEnumerable) {
        return false;
      }
      return !isExcludedKey(key) && typeof obj[key] === "function";
    })
    .forEach(([key]) => {
      instanceMethods.add(key);
    });

  let proto = obj;

  while (proto) {
    proto = Object.getPrototypeOf(proto);

    if (!proto) {
      break;
    }

    if (proto === lastConstructor.prototype) {
      if (includeLastConstructor) {
        Object.getOwnPropertyNames(proto)
          .filter((key) => {
            return typeof obj[key] === "function";
          })
          .forEach((key) => {
            instanceMethods.add(key);
          });
      }
      break;
    } else {
      Object.getOwnPropertyNames(proto)
        .filter((key) => {
          return !isExcludedKey(key) && typeof obj[key] === "function";
        })
        .forEach((key) => {
          instanceMethods.add(key);
        });
    }
  }

  return [...instanceMethods];
};
