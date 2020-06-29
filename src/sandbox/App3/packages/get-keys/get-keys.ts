import { KeyType, AnyObject } from "./types";
import { getAttributeKeys } from "./get-attribute-keys";
import { getStateKeys } from "./get-state-keys";
import { getAccessorKeys } from "./get-accessor-keys";
import { getMethodKeys } from "./get-method-keys";
import {
  isExcludedProperty,
  extendIsExcludedProperty,
} from "./is-excluded-property";

export const getKeys = <T extends Record<string, unknown>>(
  obj: T,
  keyType: KeyType,
  {
    lastConstructor,
    includeLastConstructor,
    excludeKeys = [],
    isExcludedKey: _isExcludedKey = isExcludedProperty,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastConstructor?: (...args: any[]) => AnyObject;
    includeLastConstructor?: boolean;
    excludeKeys?: string[];
    isExcludedKey?: (key: string) => boolean;
  } = {}
): string[] => {
  const _excludeKeys: Set<string> = new Set(excludeKeys);
  _isExcludedKey = extendIsExcludedProperty(_isExcludedKey);

  const isExcludedKey = excludeKeys.length
    ? (key: string) => {
        return _excludeKeys.has(key) || _isExcludedKey(key);
      }
    : _isExcludedKey;

  switch (keyType) {
    case "attributes":
      return getAttributeKeys(obj, isExcludedKey);

    case "states":
      return getStateKeys(obj, isExcludedKey);

    case "accessors":
      return getAccessorKeys(obj, {
        isExcludedKey,
        lastConstructor,
        includeLastConstructor,
      });

    case "methods":
      return getMethodKeys(obj, {
        isExcludedKey,
        lastConstructor,
        includeLastConstructor,
      });

    case "allMethods":
      return getMethodKeys(obj, {
        isExcludedKey,
        includeLastConstructor: true,
      });

    case "properties":
      return getAttributeKeys(obj, isExcludedKey).concat(
        getStateKeys(obj, isExcludedKey),
        getAccessorKeys(obj, {
          isExcludedKey,
          lastConstructor,
          includeLastConstructor,
        }),
        getMethodKeys(obj, {
          isExcludedKey,
          lastConstructor,
          includeLastConstructor,
        })
      );

    case "all":
      return getAttributeKeys(obj, isExcludedKey).concat(
        getStateKeys(obj, isExcludedKey),
        getAccessorKeys(obj, {
          isExcludedKey,
          includeLastConstructor: true,
        }),
        getMethodKeys(obj, {
          isExcludedKey,
          includeLastConstructor: true,
        })
      );

    default:
      return Object[keyType](obj).filter((key) => !isExcludedKey(key));
  }
};
