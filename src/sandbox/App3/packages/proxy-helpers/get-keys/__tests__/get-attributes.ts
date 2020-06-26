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
      }

      const obj = new Foo();

      expect(getAttributes(obj as AnyObject)).toEqual(["a", "b"]);
    });

    it("Using an instantiated object inheriting attributes from a parent", () => {
      class Foo {
        a = 1;
        b = "foo";
      }

      class Bar extends Foo {
        c = 2;
        d = "bar";
      }

      const obj = new Bar();

      expect(getAttributes(obj as AnyObject)).toEqual(["a", "b", "c", "d"]);
    });
  });
});
