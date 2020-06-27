import {
  ObsoletePrimitiveObjectProperty,
  CurrentPrimitiveObjectProperty,
  PrimitiveObjectProperty,
  obsoletePrimitiveObjectProperties,
  currentPrimitiveObjectProperties,
  isObsoletePrimitiveObjectProperty,
  isCurrentPrimitiveObjectProperty,
  isPrimitiveObjectProperty,
} from "./is-object-property";

export type ObsoletePrimitiveFunctionOwnProperty = "arguments" | "caller";
export type ObsoletePrimitiveFunctionProperty =
  | ObsoletePrimitiveFunctionOwnProperty
  | ObsoletePrimitiveObjectProperty;

export type CurrentPrimitiveFunctionOwnProperty =
  | "length"
  | "name"
  | "apply"
  | "bind"
  | "call";
export type CurrentPrimitiveFunctionProperty =
  | CurrentPrimitiveFunctionOwnProperty
  | CurrentPrimitiveObjectProperty;

export type PrimitiveFunctionOwnProperty =
  | CurrentPrimitiveFunctionOwnProperty
  | ObsoletePrimitiveFunctionOwnProperty;
export type PrimitiveFunctionProperty =
  | PrimitiveFunctionOwnProperty
  | PrimitiveObjectProperty;

export const obsoletePrimitiveFunctionOwnProperties: ObsoletePrimitiveFunctionOwnProperty[] = [
  "arguments",
  "caller",
];
export const obsoletePrimitiveFunctionProperties: ObsoletePrimitiveFunctionProperty[] = (obsoletePrimitiveFunctionOwnProperties as ObsoletePrimitiveFunctionProperty[]).concat(
  obsoletePrimitiveObjectProperties
);

export const currentPrimitiveFunctionOwnProperties: CurrentPrimitiveFunctionOwnProperty[] = [
  "length",
  "name",
  "apply",
  "bind",
  "call",
];
export const currentPrimitiveFunctionProperties: CurrentPrimitiveFunctionProperty[] = (currentPrimitiveFunctionOwnProperties as CurrentPrimitiveFunctionProperty[]).concat(
  currentPrimitiveObjectProperties
);

export const primitiveFunctionOwnProperties: PrimitiveFunctionOwnProperty[] = (currentPrimitiveFunctionOwnProperties as PrimitiveFunctionOwnProperty[]).concat(
  obsoletePrimitiveFunctionOwnProperties
);
export const primitiveFunctionProperties: PrimitiveFunctionProperty[] = (primitiveFunctionOwnProperties as PrimitiveFunctionProperty[]).concat(
  currentPrimitiveObjectProperties,
  obsoletePrimitiveObjectProperties
);

export const isObsoletePrimitiveFunctionOwnProperty = (
  propName: string
): propName is ObsoletePrimitiveFunctionOwnProperty => {
  switch (propName) {
    case "arguments":
    case "caller":
      return true;

    default:
      return false;
  }
};

export const isObsoletePrimitiveFunctionProperty = (
  propName: string
): propName is ObsoletePrimitiveFunctionProperty => {
  switch (propName) {
    case "arguments":
    case "caller":
      return true;

    default:
      return isObsoletePrimitiveObjectProperty(propName);
  }
};

export const isCurrentPrimitiveFunctionOwnProperty = (
  propName: string
): propName is CurrentPrimitiveFunctionOwnProperty => {
  switch (propName) {
    case "length":
    case "name":
    case "apply":
    case "bind":
    case "call":
      return true;

    default:
      return false;
  }
};

export const isCurrentPrimitiveFunctionProperty = (
  propName: string
): propName is CurrentPrimitiveFunctionProperty => {
  switch (propName) {
    case "length":
    case "name":
    case "apply":
    case "bind":
    case "call":
      return true;

    default:
      return isCurrentPrimitiveObjectProperty(propName);
  }
};

export const isPrimitiveFunctionOwnProperty = (
  propName: string
): propName is PrimitiveFunctionOwnProperty => {
  switch (propName) {
    case "length":
    case "name":
    case "apply":
    case "bind":
    case "call":
    case "arguments":
    case "caller":
      return true;

    default:
      return false;
  }
};

export const isPrimitiveFunctionProperty = (
  propName: string
): propName is PrimitiveFunctionProperty => {
  switch (propName) {
    case "length":
    case "name":
    case "apply":
    case "bind":
    case "call":
    case "arguments":
    case "caller":
      return true;

    default:
      return isPrimitiveObjectProperty(propName);
  }
};
