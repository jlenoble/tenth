export type ObsoletePrimitiveObjectProperty =
  | "__proto__"
  | "__defineGetter__"
  | "__defineSetter__"
  | "__lookupGetter__"
  | "__lookupSetter__";

export type CurrentPrimitiveObjectProperty =
  | "constructor"
  | "hasOwnProperty"
  | "isPrototypeOf"
  | "propertyIsEnumerable"
  | "toString"
  | "valueOf"
  | "toLocaleString";

export type PrimitiveObjectProperty =
  | CurrentPrimitiveObjectProperty
  | ObsoletePrimitiveObjectProperty;

export const obsoletePrimitiveObjectProperties: ObsoletePrimitiveObjectProperty[] = [
  "__proto__",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__",
];

export const currentPrimitiveObjectProperties: CurrentPrimitiveObjectProperty[] = [
  "constructor",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toString",
  "valueOf",
  "toLocaleString",
];

export const primitiveObjectProperties: PrimitiveObjectProperty[] = (currentPrimitiveObjectProperties as PrimitiveObjectProperty[]).concat(
  obsoletePrimitiveObjectProperties
);

export const isObsoletePrimitiveObjectProperty = (
  propName: string
): propName is ObsoletePrimitiveObjectProperty => {
  switch (propName) {
    case "__proto__":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return true;

    default:
      return false;
  }
};

export const isCurrentPrimitiveObjectProperty = (
  propName: string
): propName is CurrentPrimitiveObjectProperty => {
  switch (propName) {
    case "constructor":
    case "hasOwnProperty":
    case "isPrototypeOf":
    case "propertyIsEnumerable":
    case "toString":
    case "valueOf":
    case "toLocaleString":
      return true;

    default:
      return false;
  }
};

export const isPrimitiveObjectProperty = (
  propName: string
): propName is PrimitiveObjectProperty => {
  switch (propName) {
    case "constructor":
    case "hasOwnProperty":
    case "isPrototypeOf":
    case "propertyIsEnumerable":
    case "toString":
    case "valueOf":
    case "toLocaleString":
    case "__proto__":
    case "__defineGetter__":
    case "__defineSetter__":
    case "__lookupGetter__":
    case "__lookupSetter__":
      return true;

    default:
      return false;
  }
};
