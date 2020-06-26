import { AnyObject } from "../types";
import { getKeys } from "../get-keys";

describe("Get keys of object", () => {
  const baseObjectMethodKeys = Object.getOwnPropertyNames(
    Object.prototype
  ).filter((key) => {
    return typeof (Object.prototype as AnyObject)[key] === "function";
  });

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
      expect(getKeys(obj, "getOwnPropertyNames")).toEqual(["a", "b", "m"]);
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
      expect(getKeys(obj as AnyObject, "getOwnPropertyNames")).toEqual([
        "a",
        "b",
        "m1",
        "c",
        "d",
        "m2",
      ]);
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
    });
  });
});
