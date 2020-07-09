import { TestSuite } from "../../../testsuite";
import { BinarySearchTreeNodeConstructor } from "../../tree/binary-search-tree/types";
import { tests as parentTests } from "./binary-tree-node";
import { Comparator } from "../../../comparator";

type Obj = { a: number; b: string };

export const tests = (
  Structure: BinarySearchTreeNodeConstructor<Obj | number>
): TestSuite => ({
  ...parentTests(Structure),

  comparator({ it }): void {
    it(() => {
      const comparator = new Comparator<number>();

      const node1 = new Structure(1, comparator);
      const node2 = new Structure(2, comparator);

      expect(node1.comparator).toBe(comparator);
      expect(node2.comparator).toBe(comparator);
    });
  },

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

  _insert({ it }): void {
    it(() => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = node1._insert(o2);
      const node3 = node1._insert(o3);

      expect(node2).not.toBeNull();
      expect(node3).not.toBeNull();

      if (node2 !== null && node3 !== null) {
        expect(node1.left).toBeNull();
        expect(node1.parent).toBeNull();
        expect(node1.right).toBe(node2);

        expect(node2.left).toBeNull();
        expect(node2.parent).toBe(node1);
        expect(node2.right).toBe(node3);

        expect(node3.left).toBeNull();
        expect(node3.parent).toBe(node2);
        expect(node3.right).toBeNull();
      }
    });
  },

  insert({ it }): void {
    it(() => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      let node = new Structure(o1, comparator);
      node.insert(o2);
      node.insert(o3);

      expect(Array.from(node)).toEqual([o1, o2, o3]);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let node2 = node._find(o2)!;

      expect(Array.from(node2)).toEqual([o2, o3]);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node2 = node._find(o3)!;

      expect(Array.from(node2)).toEqual([o3]);

      node = new Structure(o2, comparator);
      node.insert(o1);
      node.insert(o3);

      expect(Array.from(node)).toEqual([o1, o2, o3]);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node2 = node._find(o1)!;

      expect(Array.from(node2)).toEqual([o1]);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node2 = node._find(o3)!;

      expect(Array.from(node2)).toEqual([o3]);

      node = new Structure(o3, comparator);
      node.insert(o1);
      node.insert(o2);

      expect(Array.from(node)).toEqual([o1, o2, o3]);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node2 = node._find(o1)!;

      expect(Array.from(node2)).toEqual([o1, o2]);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node2 = node._find(o2)!;

      expect(Array.from(node2)).toEqual([o2]);
    });
  },

  _remove({ it }): void {
    it(() => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      let node1 = new Structure(o1, comparator);
      let node2 = node1._insert(o2);
      let node3 = node1._insert(o3);

      expect(node1._remove(o3)).toBe(node3);
      expect(node1._remove(o2)).toBe(node2);
      expect(node1._remove(o1)).toBe(node1);

      node1 = new Structure(o1, comparator);
      node2 = node1._insert(o2);
      node3 = node1._insert(o3);

      expect(node1._remove(o2)).toBe(node2);
      expect(node1._remove(o3)).toBe(node2);
      expect(node1._remove(o1)).toBe(node1);

      node1 = new Structure(o1, comparator);
      node2 = node1._insert(o2);
      node3 = node1._insert(o3);

      expect(node1._remove(o1)).toBe(node1);
      expect(node1._remove(o2)).toBe(node1);
      expect(node1._remove(o3)).toBe(node1);
    });
  },

  remove({ it }): void {
    it(() => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node = new Structure(o1, comparator);
      node.insert(o2);
      node.insert(o3);

      expect(Array.from(node)).toEqual([o1, o2, o3]);

      node.remove(o2);

      expect(Array.from(node)).toEqual([o1, o3]);

      node.remove(o1);

      expect(Array.from(node)).toEqual([o3]);

      node.remove(o3);

      // Cannot remove self
      expect(Array.from(node)).toEqual([o3]);
    });
  },
});

export { staticTests } from "./binary-tree-node";
