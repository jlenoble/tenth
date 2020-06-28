import { AnyObject } from "../types";
import { getKeys } from "../get-keys";

describe("Get keys of object", () => {
  const baseObjectMethodKeys = Object.getOwnPropertyNames(
    Object.prototype
  ).filter((key) => {
    return typeof (Object.prototype as AnyObject)[key] === "function";
  });

  const isExcludedKey = (key: string) =>
    key === "a" ||
    key === "d" ||
    key === "m2" ||
    key === "m4" ||
    key === "m6" ||
    key === "h";

  describe("getKeys", () => {
    it("Using a literal object", () => {
      const obj = {
        a: 1,
        b: "foo",

        m(): number {
          return 1;
        },
      };

      expect(getKeys(obj as AnyObject, "attributes")).toEqual(["a", "b"]);
      expect(getKeys(obj as AnyObject, "states")).toEqual([]);
      expect(getKeys(obj, "methods")).toEqual(["m"]);
      expect(getKeys(obj, "allMethods")).toEqual(
        ["m"].concat(baseObjectMethodKeys)
      );
      expect(getKeys(obj, "properties")).toEqual(["a", "b", "m"]);
      expect(getKeys(obj, "all")).toEqual(
        ["a", "b", "m"].concat(baseObjectMethodKeys)
      );
      expect(getKeys(obj, "getOwnPropertyNames")).toEqual(["a", "b", "m"]);

      expect(
        getKeys(obj as AnyObject, "attributes", { isExcludedKey })
      ).toEqual(["b"]);
      expect(getKeys(obj as AnyObject, "states", { isExcludedKey })).toEqual(
        []
      );
      expect(getKeys(obj, "methods", { isExcludedKey })).toEqual(["m"]);
      expect(getKeys(obj, "allMethods", { isExcludedKey })).toEqual(
        ["m"].concat(baseObjectMethodKeys)
      );
      expect(getKeys(obj, "properties", { isExcludedKey })).toEqual(["b", "m"]);
      expect(getKeys(obj, "all", { isExcludedKey })).toEqual(
        ["b", "m"].concat(baseObjectMethodKeys)
      );
      expect(getKeys(obj, "getOwnPropertyNames", { isExcludedKey })).toEqual([
        "b",
        "m",
      ]);
    });

    it("Using an instantiated object", () => {
      class Foo {
        a = 1;
        b = "foo";
        m1 = (): number => 1;

        private c = 2;
        private d = "bar";
        private m2 = (): number => 2;

        constructor() {
          Object.defineProperties(this, {
            c: { enumerable: false },
            d: { enumerable: false },
            m2: { enumerable: false },
          });
        }

        m3(): number {
          return 3;
        }
      }

      const obj = new Foo();

      expect(getKeys(obj as AnyObject, "attributes")).toEqual(["a", "b"]);
      expect(getKeys(obj as AnyObject, "states")).toEqual(["c", "d"]);
      expect(getKeys(obj as AnyObject, "methods")).toEqual(["m1", "m2", "m3"]);
      expect(getKeys(obj as AnyObject, "allMethods")).toEqual(
        ["m1", "m2", "m3"].concat(baseObjectMethodKeys)
      );
      expect(getKeys(obj as AnyObject, "properties")).toEqual([
        "a",
        "b",
        "c",
        "d",
        "m1",
        "m2",
        "m3",
      ]);
      expect(getKeys(obj as AnyObject, "all")).toEqual(
        ["a", "b", "c", "d", "m1", "m2", "m3"].concat(baseObjectMethodKeys)
      );
      expect(getKeys(obj as AnyObject, "getOwnPropertyNames")).toEqual([
        "a",
        "b",
        "m1",
        "c",
        "d",
        "m2",
      ]);

      expect(
        getKeys(obj as AnyObject, "attributes", { isExcludedKey })
      ).toEqual(["b"]);
      expect(getKeys(obj as AnyObject, "states", { isExcludedKey })).toEqual([
        "c",
      ]);
      expect(getKeys(obj as AnyObject, "methods", { isExcludedKey })).toEqual([
        "m1",
        "m3",
      ]);
      expect(
        getKeys(obj as AnyObject, "allMethods", { isExcludedKey })
      ).toEqual(["m1", "m3"].concat(baseObjectMethodKeys));
      expect(
        getKeys(obj as AnyObject, "properties", { isExcludedKey })
      ).toEqual(["b", "c", "m1", "m3"]);
      expect(getKeys(obj as AnyObject, "all", { isExcludedKey })).toEqual(
        ["b", "c", "m1", "m3"].concat(baseObjectMethodKeys)
      );
      expect(
        getKeys(obj as AnyObject, "getOwnPropertyNames", { isExcludedKey })
      ).toEqual(["b", "m1", "c"]);
    });

    it("Using an instantiated object inheriting attributes from a parent", () => {
      class Foo {
        a = 1;
        b = "foo";
        m1 = (): number => 1;

        private c = 2;
        private d = "bar";
        private m2 = (): number => 2;

        constructor() {
          Object.defineProperties(this, {
            c: { enumerable: false },
            d: { enumerable: false },
            m2: { enumerable: false },
          });
        }

        m3(): number {
          return 3;
        }
      }

      class Bar extends Foo {
        e = 3;
        f = "baz";
        m4 = (): number => 4;

        private g = 4;
        protected h = "qux";
        private m5 = (): number => 5;
        protected m6 = (): number => 6;

        constructor() {
          super();

          Object.defineProperties(this, {
            g: { enumerable: false },
            h: { enumerable: false },
            m5: { enumerable: false },
            m6: { enumerable: false },
          });
        }

        m7(): number {
          return 7;
        }
      }

      const obj = new Bar();

      expect(getKeys(obj as AnyObject, "attributes")).toEqual([
        "a",
        "b",
        "e",
        "f",
      ]);
      expect(getKeys(obj as AnyObject, "states")).toEqual(["c", "d", "g", "h"]);
      expect(getKeys(obj as AnyObject, "methods")).toEqual([
        "m1",
        "m2",
        "m4",
        "m5",
        "m6",
        "m7",
        "m3",
      ]);
      expect(getKeys(obj as AnyObject, "allMethods")).toEqual(
        ["m1", "m2", "m4", "m5", "m6", "m7", "m3"].concat(baseObjectMethodKeys)
      );
      expect(getKeys(obj as AnyObject, "properties")).toEqual([
        "a",
        "b",
        "e",
        "f",
        "c",
        "d",
        "g",
        "h",
        "m1",
        "m2",
        "m4",
        "m5",
        "m6",
        "m7",
        "m3",
      ]);
      expect(getKeys(obj as AnyObject, "all")).toEqual(
        [
          "a",
          "b",
          "e",
          "f",
          "c",
          "d",
          "g",
          "h",
          "m1",
          "m2",
          "m4",
          "m5",
          "m6",
          "m7",
          "m3",
        ].concat(baseObjectMethodKeys)
      );
      expect(getKeys(obj as AnyObject, "getOwnPropertyNames")).toEqual([
        "a",
        "b",
        "m1",
        "c",
        "d",
        "m2",
        "e",
        "f",
        "m4",
        "g",
        "h",
        "m5",
        "m6",
      ]);

      expect(
        getKeys(obj as AnyObject, "attributes", { isExcludedKey })
      ).toEqual(["b", "e", "f"]);
      expect(getKeys(obj as AnyObject, "states", { isExcludedKey })).toEqual([
        "c",
        "g",
      ]);
      expect(getKeys(obj as AnyObject, "methods", { isExcludedKey })).toEqual([
        "m1",
        "m5",
        "m7",
        "m3",
      ]);
      expect(
        getKeys(obj as AnyObject, "allMethods", { isExcludedKey })
      ).toEqual(["m1", "m5", "m7", "m3"].concat(baseObjectMethodKeys));
      expect(
        getKeys(obj as AnyObject, "properties", { isExcludedKey })
      ).toEqual(["b", "e", "f", "c", "g", "m1", "m5", "m7", "m3"]);
      expect(getKeys(obj as AnyObject, "all", { isExcludedKey })).toEqual(
        ["b", "e", "f", "c", "g", "m1", "m5", "m7", "m3"].concat(
          baseObjectMethodKeys
        )
      );
      expect(
        getKeys(obj as AnyObject, "getOwnPropertyNames", { isExcludedKey })
      ).toEqual(["b", "m1", "c", "e", "f", "g", "m5"]);
    });
  });
});
