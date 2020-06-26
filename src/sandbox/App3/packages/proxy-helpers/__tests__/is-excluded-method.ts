import { isExcludedMethod } from "../is-excluded-method";

describe("isExcludedMethod(methodName)", () => {
  ["constructor", "call", "apply", "bind"].forEach((methodName) => {
    it(`returns true on ${methodName}`, () => {
      expect(isExcludedMethod(methodName)).toBe(true);
    });
  });

  it(`returns false except on "constructor/call/apply/bind"`, () => {
    ["a", "foo", ""].forEach((methodName) => {
      expect(isExcludedMethod(methodName)).toBe(false);
    });
  });
});
