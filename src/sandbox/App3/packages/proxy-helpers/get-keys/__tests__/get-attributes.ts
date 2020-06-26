import { AnyObject } from "../types";
import { getAttributes } from "../get-attributes";

describe("Get attributes of object", () => {
  describe("getAttributes", () => {
    it("Using a literal object", () => {
      const obj = {
        a: 1,
        b: "foo",
      };

      expect(getAttributes(obj)).toEqual(["a", "b"]);
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

      expect(getAttributes(obj as AnyObject)).toEqual(["a", "b"]);
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

      expect(getAttributes(obj as AnyObject)).toEqual(["a", "b", "e", "f"]);
    });
  });
});
