import {
  primitiveObjectConstructorOwnProperties,
  isPrimitiveObjectConstructorOwnProperty,
  primitiveObjectConstructorProperties,
  isPrimitiveObjectConstructorProperty,
} from "../is-object-constructor-property";
import { primitiveFunctionOwnProperties } from "../is-function-property";
import { primitiveObjectProperties } from "../is-object-property";

describe("Primitive object constructor properties", () => {
  Object.getOwnPropertyNames(Object).forEach((name) => {
    it(`Sanity check: "${name}" in Object.getOwnPropertyNames(Object)`, () => {
      expect(isPrimitiveObjectConstructorProperty(name)).toBe(true);
    });
  });

  primitiveObjectConstructorOwnProperties.forEach((name) => {
    it(`isPrimitiveObjectConstructor(Own)Property on "${name}"`, () => {
      expect(isPrimitiveObjectConstructorOwnProperty(name)).toBe(true);
      expect(isPrimitiveObjectConstructorProperty(name)).toBe(true);
    });
  });

  primitiveObjectConstructorProperties.forEach((name) => {
    it(`isPrimitiveObjectConstructor(Own)Property on "${name}"`, () => {
      expect(isPrimitiveObjectConstructorProperty(name)).toBe(true);
    });
  });

  primitiveFunctionOwnProperties.forEach((name) => {
    it(`isPrimitiveObjectConstructor(Own)Property on "${name}"`, () => {
      expect(isPrimitiveObjectConstructorOwnProperty(name)).toBe(false);
      expect(isPrimitiveObjectConstructorProperty(name)).toBe(true);
    });
  });

  primitiveObjectProperties.forEach((name) => {
    it(`isPrimitiveObjectConstructor(Own)Property on "${name}"`, () => {
      expect(isPrimitiveObjectConstructorOwnProperty(name)).toBe(false);
      expect(isPrimitiveObjectConstructorProperty(name)).toBe(true);
    });
  });

  ["a", "foo", ""].forEach((name) => {
    it(`isPrimitiveObjectConstructor(Own)Property on "${name}"`, () => {
      expect(isPrimitiveObjectConstructorOwnProperty(name)).toBe(false);
      expect(isPrimitiveObjectConstructorProperty(name)).toBe(false);
    });
  });
});
