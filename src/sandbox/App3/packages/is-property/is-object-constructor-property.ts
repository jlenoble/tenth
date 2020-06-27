import {
  PrimitiveFunctionProperty,
  primitiveFunctionProperties,
  isPrimitiveFunctionProperty,
} from "./is-function-property";

export type PrimitiveObjectConstructorOwnProperty =
  | "prototype"
  | "assign"
  | "getOwnPropertyDescriptor"
  | "getOwnPropertyDescriptors"
  | "getOwnPropertyNames"
  | "getOwnPropertySymbols"
  | "is"
  | "preventExtensions"
  | "seal"
  | "create"
  | "defineProperties"
  | "defineProperty"
  | "freeze"
  | "getPrototypeOf"
  | "setPrototypeOf"
  | "isExtensible"
  | "isFrozen"
  | "isSealed"
  | "keys"
  | "entries"
  | "values"
  | "fromEntries";

export type PrimitiveObjectConstructorProperty =
  | PrimitiveObjectConstructorOwnProperty
  | PrimitiveFunctionProperty;

export const primitiveObjectConstructorOwnProperties: PrimitiveObjectConstructorOwnProperty[] = [
  "prototype",
  "assign",
  "getOwnPropertyDescriptor",
  "getOwnPropertyDescriptors",
  "getOwnPropertyNames",
  "getOwnPropertySymbols",
  "is",
  "preventExtensions",
  "seal",
  "create",
  "defineProperties",
  "defineProperty",
  "freeze",
  "getPrototypeOf",
  "setPrototypeOf",
  "isExtensible",
  "isFrozen",
  "isSealed",
  "keys",
  "entries",
  "values",
  "fromEntries",
];

export const primitiveObjectConstructorProperties: PrimitiveObjectConstructorProperty[] = (primitiveObjectConstructorOwnProperties as PrimitiveObjectConstructorProperty[]).concat(
  primitiveFunctionProperties
);

export const isPrimitiveObjectConstructorOwnProperty = (
  propName: string
): propName is PrimitiveObjectConstructorOwnProperty => {
  switch (propName) {
    case "prototype":
    case "assign":
    case "getOwnPropertyDescriptor":
    case "getOwnPropertyDescriptors":
    case "getOwnPropertyNames":
    case "getOwnPropertySymbols":
    case "is":
    case "preventExtensions":
    case "seal":
    case "create":
    case "defineProperties":
    case "defineProperty":
    case "freeze":
    case "getPrototypeOf":
    case "setPrototypeOf":
    case "isExtensible":
    case "isFrozen":
    case "isSealed":
    case "keys":
    case "entries":
    case "values":
    case "fromEntries":
      return true;

    default:
      return false;
  }
};

export const isPrimitiveObjectConstructorProperty = (
  propName: string
): propName is PrimitiveObjectConstructorProperty => {
  return (
    isPrimitiveObjectConstructorOwnProperty(propName) ||
    isPrimitiveFunctionProperty(propName)
  );
};
