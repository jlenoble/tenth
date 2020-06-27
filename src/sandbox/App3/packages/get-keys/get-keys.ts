import { KeyType } from "./types";
import { getAttributeKeys } from "./get-attribute-keys";
import { getStateKeys } from "./get-state-keys";
import { getMethodKeys } from "./get-method-keys";

export const getKeys = <T extends Record<string, unknown>>(
  obj: T,
  keyType: KeyType
): string[] => {
  switch (keyType) {
    case "attributes":
      return getAttributeKeys(obj);

    case "states":
      return getStateKeys(obj);

    case "methods":
      return getMethodKeys(obj);

    case "allMethods":
      return getMethodKeys(obj, { includeLastPrototype: true });

    case "properties":
      return getAttributeKeys(obj).concat(
        getStateKeys(obj),
        getMethodKeys(obj)
      );

    case "all":
      return getAttributeKeys(obj).concat(
        getStateKeys(obj),
        getMethodKeys(obj, { includeLastPrototype: true })
      );

    default:
      return Object[keyType](obj);
  }
};
