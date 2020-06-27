import { isExcludedProperty } from "../is-excluded-property";

describe("isExcludedProperty(propName)", () => {
  [
    "constructor",
    "call",
    "apply",
    "bind",
    "caller",
    "callee",
    "arguments",
  ].forEach((propName) => {
    it(`returns true on ${propName}`, () => {
      expect(isExcludedProperty(propName)).toBe(true);
    });
  });

  it(`returns false except on "constructor/call/apply/bind"`, () => {
    ["a", "foo", ""].forEach((propName) => {
      expect(isExcludedProperty(propName)).toBe(false);
    });
  });
});
