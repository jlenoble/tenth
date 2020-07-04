import { makeTestSuite } from "../../../../testsuite";
import { BinarySearchTree } from "../binary-search-tree";
import { Comparator } from "../../../../comparator";

makeTestSuite(
  BinarySearchTree,
  {
    comparator({ it }): void {
      it(() => {
        const comparator = new Comparator<number>();
        const tree = new BinarySearchTree(comparator);
        expect(tree.comparator).toBe(comparator);
      });
    },

    insert(): void {
      it("inserting", () => {
        const comparator = new Comparator<number>();
        const tree = new BinarySearchTree(comparator);

        tree.insert(1);
        tree.insert(10);
        tree.insert(12);
        tree.insert(5);
        tree.insert(33);
        tree.insert(21);

        expect(Array.from(tree)).toEqual([1, 5, 10, 12, 21, 33]);
      });
    },

    remove(): void {
      it("removing", () => {
        const comparator = new Comparator<number>();
        const tree = new BinarySearchTree(comparator);

        tree.insert(1);
        tree.insert(10);
        tree.insert(12);
        tree.insert(5);
        tree.insert(33);
        tree.insert(21);

        expect(Array.from(tree)).toEqual([1, 5, 10, 12, 21, 33]);

        expect(tree.remove(10)).toBe(true);
        expect(Array.from(tree)).toEqual([1, 5, 12, 21, 33]);

        expect(tree.remove(1)).toBe(true);
        expect(Array.from(tree)).toEqual([5, 12, 21, 33]);

        expect(tree.remove(14)).toBe(false);
        expect(Array.from(tree)).toEqual([5, 12, 21, 33]);

        expect(tree.remove(33)).toBe(true);
        expect(Array.from(tree)).toEqual([5, 12, 21]);

        expect(tree.remove(8)).toBe(false);
        expect(Array.from(tree)).toEqual([5, 12, 21]);

        expect(tree.remove(12)).toBe(true);
        expect(Array.from(tree)).toEqual([5, 21]);

        expect(tree.remove(21)).toBe(true);
        expect(Array.from(tree)).toEqual([5]);

        expect(tree.remove(5)).toBe(true);
        expect(Array.from(tree)).toEqual([]);

        expect(tree.remove(5)).toBe(false);
        expect(Array.from(tree)).toEqual([]);
      });
    },

    has(): void {
      it("testing", () => {
        const comparator = new Comparator<number>();
        const tree = new BinarySearchTree(comparator);

        tree.insert(1);
        tree.insert(10);
        tree.insert(12);
        tree.insert(5);
        tree.insert(33);
        tree.insert(21);

        expect(tree.has(10)).toBe(true);
        expect(tree.has(33)).toBe(true);
        expect(tree.has(4)).toBe(false);
        expect(tree.has(1)).toBe(true);
        expect(tree.has(17)).toBe(false);
      });
    },

    root: false, // protected
  },
  {
    length({ it }): void {
      it(() => {
        expect(BinarySearchTree.length).toEqual(1);
      });
    },

    name({ it }): void {
      it(() => {
        expect(BinarySearchTree.name).toEqual("BinarySearchTree");
      });
    },
  }
);
