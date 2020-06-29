import { AnyObject } from "../types";
import { getAccessorKeys } from "../get-accessor-keys";

describe("Get accessor keys of object", () => {
  describe("getAccessorKeys", () => {
    it("Using a literal object", () => {
      const obj = {
        a: 1,
        b: "foo",

        get m1(): number {
          return 1;
        },
        m2(): number {
          return 1;
        },
      };

      expect(getAccessorKeys(obj)).toEqual([]);
      expect(
        getAccessorKeys(obj as AnyObject, {
          isExcludedKey: (key: string) => key === "m1",
        })
      ).toEqual([]);
    });

    it("Using an instantiated object", () => {
      class Foo {
        a = 1;
        b = "foo";
        m1 = (): number => 1;
        get m4(): number {
          return 4;
        }
        set m5(n: number) {
          this.a = n;
        }

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

      expect(getAccessorKeys(obj as AnyObject)).toEqual(["m4", "m5"]);
      expect(
        getAccessorKeys(obj as AnyObject, {
          isExcludedKey: (key: string) => key === "m4",
        })
      ).toEqual(["m5"]);
    });

    it("Using an instantiated object inheriting attributes from a parent", () => {
      class Foo {
        a = 1;
        b = "foo";
        m1 = (): number => 1;
        get m8(): number {
          return 4;
        }
        set m9(n: number) {
          this.a = n;
        }

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
        get m10(): number {
          return 4;
        }
        set m11(n: number) {
          this.a = n;
        }

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

      expect(getAccessorKeys(obj as AnyObject)).toEqual([
        "m10",
        "m11",
        "m8",
        "m9",
      ]);
      expect(
        getAccessorKeys(obj as AnyObject, {
          isExcludedKey: (key: string) => key === "m11" || key === "m8",
        })
      ).toEqual(["m10", "m9"]);
    });
  });
});
