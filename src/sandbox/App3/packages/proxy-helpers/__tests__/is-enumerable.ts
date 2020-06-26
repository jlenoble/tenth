import { isEnumerable } from "../is-enumerable";

describe("isEnumerable(obj)", () => {
  it("returns true on non empty objects, arrays and proxies", () => {
    [[2, 4], { name: "foo", age: 100 }, new Proxy({ name: "bar" }, {})].forEach(
      (goodArg) => {
        expect(isEnumerable(goodArg)).toBe(true);
      }
    );
  });

  it("returns false on empty objects, arrays and proxies", () => {
    [[], {}, new Proxy({}, {})].forEach((badArg) => {
      expect(isEnumerable(badArg)).toBe(false);
    });
  });

  it("returns false on base types, strings, functions, symbols", () => {
    [
      2,
      true,
      false,
      /.*/,
      new Date(),
      undefined,
      NaN,
      null,
      Infinity,
      Promise.resolve(),
      function () {}, // eslint-disable-line @typescript-eslint/no-empty-function
      "",
      new Function(),
      Symbol("quux"),
      "foo",
      new String("bobo"), // eslint-disable-line no-new-wrappers
    ].forEach((badArg) => {
      expect(isEnumerable(badArg)).toBe(false);
    });
  });
});
