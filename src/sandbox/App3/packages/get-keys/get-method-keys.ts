import { isExcludedProperty } from "./is-excluded-property";

export const getMethodKeys = <T extends Record<string, unknown>>(
  obj: T,
  {
    lastPrototype = Object.prototype,
    includeLastPrototype = false,
    excludeKeys = [],
    isExcludedKey = isExcludedProperty,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastPrototype?: any;
    includeLastPrototype?: boolean;
    excludeKeys?: string[];
    isExcludedKey?: (key: string) => boolean;
  } = {}
): string[] => {
  const instanceMethods = new Set<string>();
  const _excludeKeys: Set<string> = new Set(excludeKeys);

  const _isExcludedKey = isExcludedKey
    ? excludeKeys.length
      ? (key: string) => {
          return _excludeKeys.has(key) || isExcludedKey(key);
        }
      : isExcludedKey
    : excludeKeys.length
    ? (key: string) => _excludeKeys.has(key)
    : () => false;

  Object.getOwnPropertyNames(obj)
    .filter((key) => {
      return !_isExcludedKey(key) && typeof obj[key] === "function";
    })
    .forEach((key) => {
      instanceMethods.add(key);
    });

  let proto = obj;

  while (proto) {
    proto = Object.getPrototypeOf(proto);

    if (!proto) {
      break;
    }

    if (proto === lastPrototype) {
      if (includeLastPrototype) {
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
          return !_isExcludedKey(key) && typeof obj[key] === "function";
        })
        .forEach((key) => {
          instanceMethods.add(key);
        });
    }
  }

  return [...instanceMethods];
};
