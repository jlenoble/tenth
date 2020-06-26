import { isExcludedMethod } from "../is-excluded-method";

describe("isExcludedMethod(method)", () => {
  ["constructor", "call", "apply", "bind"].forEach((method) => {
    it(`returns true on ${method}`, () => {
      expect(isExcludedMethod(method)).toBe(true);
    });
  });

  it(`returns false except on "constructor/call/apply/bind"`, () => {
    ["a", "foo", ""].forEach((method) => {
      expect(isExcludedMethod(method)).toBe(false);
    });
  });
});
