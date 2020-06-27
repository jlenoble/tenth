import { KeyType } from "./types";
import { getAttributeKeys } from "./get-attribute-keys";
import { getStateKeys } from "./get-state-keys";
import { getMethodKeys } from "./get-method-keys";

export const getKeys = <T extends Record<string, unknown>>(
  obj: T,
  keyType: KeyType,
  {
    lastPrototype,
    includeLastPrototype,
    excludeKeys,
    isExcludedKey,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastPrototype?: any;
    includeLastPrototype?: boolean;
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
        lastPrototype,
        includeLastPrototype,
      });

    case "allMethods":
      return getMethodKeys(obj, {
        excludeKeys,
        isExcludedKey,
        includeLastPrototype: true,
      });

    case "properties":
      return getAttributeKeys(obj).concat(
        getStateKeys(obj),
        getMethodKeys(obj)
      );

    case "all":
      return getAttributeKeys(obj).concat(
        getStateKeys(obj),
        getMethodKeys(obj, {
          excludeKeys,
          isExcludedKey,
          includeLastPrototype: true,
        })
      );

    default:
      return Object[keyType](obj);
  }
};
