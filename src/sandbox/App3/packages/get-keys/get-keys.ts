import { KeyType, AnyObject } from "./types";
import { getAttributeKeys } from "./get-attribute-keys";
import { getStateKeys } from "./get-state-keys";
import { getMethodKeys } from "./get-method-keys";

export const getKeys = <T extends Record<string, unknown>>(
  obj: T,
  keyType: KeyType,
  {
    lastConstructor,
    includeLastConstructor,
    excludeKeys,
    isExcludedKey,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastConstructor?: (...args: any[]) => AnyObject;
    includeLastConstructor?: boolean;
    excludeKeys?: string[];
    isExcludedKey?: (key: string) => boolean;
  } = {}
): string[] => {
  switch (keyType) {
    case "attributes":
      return getAttributeKeys(obj);

    case "states":
      return getStateKeys(obj);

    case "methods":
      return getMethodKeys(obj, {
        excludeKeys,
        isExcludedKey,
        lastConstructor,
        includeLastConstructor,
      });

    case "allMethods":
      return getMethodKeys(obj, {
        excludeKeys,
        isExcludedKey,
        includeLastConstructor: true,
      });

    case "properties":
      return getAttributeKeys(obj).concat(
        getStateKeys(obj),
        getMethodKeys(obj, {
          excludeKeys,
          isExcludedKey,
          lastConstructor,
          includeLastConstructor,
        })
      );

    case "all":
      return getAttributeKeys(obj).concat(
        getStateKeys(obj),
        getMethodKeys(obj, {
          excludeKeys,
          isExcludedKey,
          includeLastConstructor: true,
        })
      );

    default:
      return Object[keyType](obj);
  }
};
