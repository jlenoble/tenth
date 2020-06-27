import {
  obsoletePrimitiveObjectProperties,
  currentPrimitiveObjectProperties,
  primitiveObjectProperties,
  isObsoletePrimitiveObjectProperty,
  isCurrentPrimitiveObjectProperty,
  isPrimitiveObjectProperty,
} from "../is-object-property";

describe("Primitive object properties", () => {
  const obsoleteProperties = [
    "__proto__",
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__",
  ];

  const currentProperties = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toString",
    "valueOf",
    "toLocaleString",
  ];

  const properties = [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toString",
    "valueOf",
    "toLocaleString",
    "__proto__",
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__",
  ];

  it("Sanity check: equalities in extension", () => {
    expect(obsoleteProperties).toEqual(obsoletePrimitiveObjectProperties);
    expect(currentProperties).toEqual(currentPrimitiveObjectProperties);
    expect(properties).toEqual(primitiveObjectProperties);
    expect(properties).toEqual(currentProperties.concat(obsoleteProperties));
  });

  obsoleteProperties.forEach((name) => {
    it(`isObsoletePrimitiveObjectProperty returns true on "${name}"`, () => {
      expect(isObsoletePrimitiveObjectProperty(name)).toBe(true);
      expect(isPrimitiveObjectProperty(name)).toBe(true);
    });
  });

  ["a", "foo", "", ...currentProperties].forEach((name) => {
    it(`isObsoletePrimitiveObjectProperty returns false on "${name}"`, () => {
      expect(isObsoletePrimitiveObjectProperty(name)).toBe(false);
    });
  });

  currentProperties.forEach((name) => {
    it(`isCurrentPrimitiveObjectProperty returns true on "${name}"`, () => {
      expect(isCurrentPrimitiveObjectProperty(name)).toBe(true);
      expect(isPrimitiveObjectProperty(name)).toBe(true);
    });
  });

  ["a", "foo", "", ...obsoleteProperties].forEach((name) => {
    it(`isCurrentPrimitiveObjectProperty returns false on "${name}"`, () => {
      expect(isCurrentPrimitiveObjectProperty(name)).toBe(false);
    });
  });

  properties.forEach((name) => {
    it(`isPrimitiveObjectProperty returns true on "${name}"`, () => {
      expect(isPrimitiveObjectProperty(name)).toBe(true);
    });
  });

  ["a", "foo", ""].forEach((name) => {
    it(`isPrimitiveObjectProperty returns false on "${name}"`, () => {
      expect(isPrimitiveObjectProperty(name)).toBe(false);
    });
  });
});
