import {
  isExcludedProperty,
  extendIsExcludedProperty,
} from "./is-excluded-property";
import { isAccessor } from "./is-accessor";

export const getAccessorKeys = <T extends Record<string, unknown>>(
  obj: T,
  {
    lastConstructor = Object,
    includeLastConstructor = false,
    isExcludedKey = isExcludedProperty,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastConstructor?: any;
    includeLastConstructor?: boolean;
    isExcludedKey?: (key: string) => boolean;
  } = {}
): string[] => {
  const instanceAccessors = new Set<string>();
  isExcludedKey = extendIsExcludedProperty(isExcludedKey);

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
            return isAccessor(proto, key);
          })
          .forEach((key) => {
            instanceAccessors.add(key);
          });
      }
      break;
    } else {
      Object.getOwnPropertyNames(proto)
        .filter((key) => {
          return !isExcludedKey(key) && isAccessor(proto, key);
        })
        .forEach((key) => {
          instanceAccessors.add(key);
        });
    }
  }

  return [...instanceAccessors];
};
