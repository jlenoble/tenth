import { AnyObject } from "../types";
import { getStateKeys } from "../get-state-keys";

describe("Get state keys of object", () => {
  describe("getStateKeys", () => {
    it("Using a literal object", () => {
      const obj = {
        a: 1,
        b: "foo",
      };

      expect(getStateKeys(obj)).toEqual([]);
    });

    it("Using an instantiated object", () => {
      class Foo {
        a = 1;
        b = "foo";
        private c: number;
        private d: string;

        constructor() {
          this.c = 2;
          this.d = "bar";

          Object.defineProperties(this, {
            c: { enumerable: false },
            d: { enumerable: false },
          });
        }
      }

      const obj = new Foo();

      expect(getStateKeys(obj as AnyObject)).toEqual(["c", "d"]);
    });

    it("Using an instantiated object inheriting attributes from a parent", () => {
      class Foo {
        a = 1;
        b = "foo";
        private c: number;
        private d: string;

        constructor() {
          this.c = 2;
          this.d = "bar";

          Object.defineProperties(this, {
            c: { enumerable: false },
            d: { enumerable: false },
          });
        }
      }

      class Bar extends Foo {
        e = 3;
        f = "baz";
        private g: number;
        protected h: string;

        constructor() {
          super();

          this.g = 4;
          this.h = "qux";

          Object.defineProperties(this, {
            g: { enumerable: false },
            h: { enumerable: false },
          });
        }
      }

      const obj = new Bar();

      expect(getStateKeys(obj as AnyObject)).toEqual(["c", "d", "g", "h"]);
    });
  });
});
