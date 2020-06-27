import { isExcludedProperty } from "../is-excluded-property";

export const getMethodKeys = <T extends Record<string, unknown>>(
  obj: T,
  includeObjectMethodKeys = false
): string[] => {
  const instanceMethods = new Set<string>();

  Object.getOwnPropertyNames(obj)
    .filter((key) => {
      return !isExcludedProperty(key) && typeof obj[key] === "function";
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

    if (proto === Object.prototype) {
      if (includeObjectMethodKeys) {
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
          return !isExcludedProperty(key) && typeof obj[key] === "function";
        })
        .forEach((key) => {
          instanceMethods.add(key);
        });
    }
  }

  return [...instanceMethods];
};
