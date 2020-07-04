import { makeTestSuite } from "../../../../testsuite";
import { BinarySearchTree } from "../binary-search-tree";
import { Comparator } from "../../../../comparator";

makeTestSuite(
  BinarySearchTree,
  {
    root({ it }): void {
      it(() => {
        const comparator = new Comparator<number>();
        const tree = new BinarySearchTree(comparator);
        expect(tree.root).toBeNull();
      });
    },

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
        expect(tree.root).toBeNull();

        tree.insert(1);
        tree.insert(10);
        tree.insert(12);
        tree.insert(5);
        tree.insert(33);
        tree.insert(21);

        expect(Array.from(tree)).toEqual([1, 5, 10, 12, 21, 33]);
      });
    },
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
