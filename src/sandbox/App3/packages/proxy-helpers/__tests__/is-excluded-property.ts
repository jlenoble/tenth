import { isExcludedProperty } from "../is-excluded-property";

describe("isExcludedProperty(methodName)", () => {
  ["constructor", "call", "apply", "bind", "caller", "arguments"].forEach(
    (methodName) => {
      it(`returns true on ${methodName}`, () => {
        expect(isExcludedProperty(methodName)).toBe(true);
      });
    }
  );

  it(`returns false except on "constructor/call/apply/bind"`, () => {
    ["a", "foo", ""].forEach((methodName) => {
      expect(isExcludedProperty(methodName)).toBe(false);
    });
  });
});
