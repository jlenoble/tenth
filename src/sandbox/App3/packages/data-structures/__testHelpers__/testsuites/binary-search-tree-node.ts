import { TestSuite } from "../../../testsuite";
import { BinarySearchTreeNodeConstructor } from "../../tree/binary-search-tree/types";
import { tests as parentTests } from "./binary-tree-node";
import { Comparator } from "../../../comparator";

type Obj = { a: number; b: string };

export const tests = (
  Structure: BinarySearchTreeNodeConstructor<Obj | number>
): TestSuite => ({
  ...parentTests(Structure),

  has({ it }): void {
    it(() => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);

      expect(node1.has(o1)).toBe(true);
      expect(node1.has(o2)).toBe(false);
      expect(node1.has(o3)).toBe(false);

      expect(node2.has(o1)).toBe(false);
      expect(node2.has(o2)).toBe(true);
      expect(node2.has(o3)).toBe(false);

      expect(node3.has(o1)).toBe(false);
      expect(node3.has(o2)).toBe(false);
      expect(node3.has(o3)).toBe(true);

      // Corrupted order
      node1.left = node2;
      // Correct order
      node1.right = node3;

      expect(node1.has(o1)).toBe(true);
      expect(node1.has(o2)).toBe(false);
      expect(node1.has(o3)).toBe(true);

      expect(node2.has(o1)).toBe(false);
      expect(node2.has(o2)).toBe(true);
      expect(node2.has(o3)).toBe(false);

      expect(node3.has(o1)).toBe(false);
      expect(node3.has(o2)).toBe(false);
      expect(node3.has(o3)).toBe(true);

      node1.left = null;
      node1.right = null;

      // Correct order
      node2.left = node1;
      // Correct order
      node2.right = node3;

      expect(node1.has(o1)).toBe(true);
      expect(node1.has(o2)).toBe(false);
      expect(node1.has(o3)).toBe(false);

      expect(node2.has(o1)).toBe(true);
      expect(node2.has(o2)).toBe(true);
      expect(node2.has(o3)).toBe(true);

      expect(node3.has(o1)).toBe(false);
      expect(node3.has(o2)).toBe(false);
      expect(node3.has(o3)).toBe(true);
    });
  },

  _find({ it }): void {
    it(() => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);

      expect(node1._find(o1)).toBe(node1);
      expect(node1._find(o2)).toBe(null);
      expect(node1._find(o3)).toBe(null);

      expect(node2._find(o1)).toBe(null);
      expect(node2._find(o2)).toBe(node2);
      expect(node2._find(o3)).toBe(null);

      expect(node3._find(o1)).toBe(null);
      expect(node3._find(o2)).toBe(null);
      expect(node3._find(o3)).toBe(node3);

      // Corrupted order
      node1.left = node2;
      // Correct order
      node1.right = node3;

      expect(node1._find(o1)).toBe(node1);
      expect(node1._find(o2)).toBe(null);
      expect(node1._find(o3)).toBe(node3);

      expect(node2._find(o1)).toBe(null);
      expect(node2._find(o2)).toBe(node2);
      expect(node2._find(o3)).toBe(null);

      expect(node3._find(o1)).toBe(null);
      expect(node3._find(o2)).toBe(null);
      expect(node3._find(o3)).toBe(node3);

      node1.left = null;
      node1.right = null;

      // Correct order
      node3.left = node2;
      // Correct order
      node2.left = node1;

      expect(node1._find(o1)).toBe(node1);
      expect(node1._find(o2)).toBe(null);
      expect(node1._find(o3)).toBe(null);

      expect(node2._find(o1)).toBe(node1);
      expect(node2._find(o2)).toBe(node2);
      expect(node2._find(o3)).toBe(null);

      expect(node3._find(o1)).toBe(node1);
      expect(node3._find(o2)).toBe(node2);
      expect(node3._find(o3)).toBe(node3);
    });
  },

  _findMin({ it }): void {
    it(() => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);

      node3.left = node2;
      node2.left = node1;

      expect(node1._findMin()).toBe(node1);
      expect(node2._findMin()).toBe(node1);
      expect(node3._findMin()).toBe(node1);

      node3.left = null;
      node2.left = null;

      node2.left = node1;
      node2.right = node3;

      expect(node1._findMin()).toBe(node1);
      expect(node2._findMin()).toBe(node1);
      expect(node3._findMin()).toBe(node3);

      node3.left = null;
      node2.left = null;

      node1.right = node2;
      node2.right = node3;

      expect(node1._findMin()).toBe(node1);
      expect(node2._findMin()).toBe(node2);
      expect(node3._findMin()).toBe(node3);
    });
  },
});

export { staticTests } from "./binary-tree-node";
