import { AnyObject } from "../types";
import { getStateKeys } from "../get-state-keys";

describe("Get state keys of object", () => {
  describe("getStateKeys", () => {
    it("Using a literal object", () => {
      const obj = {
        a: 1,
        b: "foo",

        m(): number {
          return 1;
        },
      };

      expect(getStateKeys(obj)).toEqual([]);
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

      expect(getStateKeys(obj as AnyObject)).toEqual(["c", "d"]);
      expect(
        getStateKeys(obj as AnyObject, (key: string) => key === "d")
      ).toEqual(["c"]);
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

      expect(getStateKeys(obj as AnyObject)).toEqual(["c", "d", "g", "h"]);
      expect(
        getStateKeys(
          obj as AnyObject,
          (key: string) => key === "c" || key === "h"
        )
      ).toEqual(["d", "g"]);
    });
  });
});
