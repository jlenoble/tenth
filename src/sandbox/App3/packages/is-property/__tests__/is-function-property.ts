import {
  obsoletePrimitiveFunctionOwnProperties,
  currentPrimitiveFunctionOwnProperties,
  primitiveFunctionOwnProperties,
  isObsoletePrimitiveFunctionOwnProperty,
  isCurrentPrimitiveFunctionOwnProperty,
  isPrimitiveFunctionOwnProperty,
  obsoletePrimitiveFunctionProperties,
  currentPrimitiveFunctionProperties,
  primitiveFunctionProperties,
  isObsoletePrimitiveFunctionProperty,
  isCurrentPrimitiveFunctionProperty,
  isPrimitiveFunctionProperty,
} from "../is-function-property";

describe("Primitive object properties", () => {
  const obsoleteObjectProperties = [
    "__proto__",
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__",
  ];

  const currentObjectProperties = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toString",
    "valueOf",
    "toLocaleString",
  ];

  const obsoleteProperties = ["arguments", "caller"];

  const currentProperties = ["length", "name", "apply", "bind", "call"];

  it("Sanity check: equalities in extension", () => {
    expect(obsoleteProperties).toEqual(obsoletePrimitiveFunctionOwnProperties);
    expect(currentProperties).toEqual(currentPrimitiveFunctionOwnProperties);
    expect(currentProperties.concat(obsoleteProperties)).toEqual(
      primitiveFunctionOwnProperties
    );

    expect(obsoleteProperties.concat(obsoleteObjectProperties)).toEqual(
      obsoletePrimitiveFunctionProperties
    );
    expect(currentProperties.concat(currentObjectProperties)).toEqual(
      currentPrimitiveFunctionProperties
    );
    expect(
      currentProperties.concat(
        obsoleteProperties,
        currentObjectProperties,
        obsoleteObjectProperties
      )
    ).toEqual(primitiveFunctionProperties);
  });

  Object.getOwnPropertyNames(Function.prototype).forEach((name) => {
    it(`Sanity check: "${name}" in Object.getOwnPropertyNames(Function.prototype)`, () => {
      expect(isPrimitiveFunctionProperty(name)).toBe(true);
    });
  });

  obsoleteProperties.forEach((name) => {
    it(`is(Obsolete/Current)PrimitiveFunction(Own)Property on "${name}"`, () => {
      expect(isObsoletePrimitiveFunctionOwnProperty(name)).toBe(true);
      expect(isCurrentPrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isPrimitiveFunctionOwnProperty(name)).toBe(true);
      expect(isObsoletePrimitiveFunctionProperty(name)).toBe(true);
      expect(isCurrentPrimitiveFunctionProperty(name)).toBe(false);
      expect(isPrimitiveFunctionProperty(name)).toBe(true);
    });
  });

  currentProperties.forEach((name) => {
    it(`is(Obsolete/Current)PrimitiveFunction(Own)Property on "${name}"`, () => {
      expect(isObsoletePrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isCurrentPrimitiveFunctionOwnProperty(name)).toBe(true);
      expect(isPrimitiveFunctionOwnProperty(name)).toBe(true);
      expect(isObsoletePrimitiveFunctionProperty(name)).toBe(false);
      expect(isCurrentPrimitiveFunctionProperty(name)).toBe(true);
      expect(isPrimitiveFunctionProperty(name)).toBe(true);
    });
  });

  obsoleteObjectProperties.forEach((name) => {
    it(`is(Obsolete/Current)PrimitiveFunction(Own)Property on "${name}"`, () => {
      expect(isObsoletePrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isCurrentPrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isPrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isObsoletePrimitiveFunctionProperty(name)).toBe(true);
      expect(isCurrentPrimitiveFunctionProperty(name)).toBe(false);
      expect(isPrimitiveFunctionProperty(name)).toBe(true);
    });
  });

  currentObjectProperties.forEach((name) => {
    it(`is(Obsolete/Current)PrimitiveFunction(Own)Property on "${name}"`, () => {
      expect(isObsoletePrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isCurrentPrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isPrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isObsoletePrimitiveFunctionProperty(name)).toBe(false);
      expect(isCurrentPrimitiveFunctionProperty(name)).toBe(true);
      expect(isPrimitiveFunctionProperty(name)).toBe(true);
    });
  });

  ["a", "foo", ""].forEach((name) => {
    it(`is(Obsolete/Current)PrimitiveFunction(Own)Property on "${name}"`, () => {
      expect(isObsoletePrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isCurrentPrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isPrimitiveFunctionOwnProperty(name)).toBe(false);
      expect(isObsoletePrimitiveFunctionProperty(name)).toBe(false);
      expect(isCurrentPrimitiveFunctionProperty(name)).toBe(false);
      expect(isPrimitiveFunctionProperty(name)).toBe(false);
    });
  });
});
