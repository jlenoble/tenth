import { TestSuite } from "../../../testsuite";
import {
  BinarySearchTreeConstructor,
  BinarySearchTreeNode,
} from "../../tree/binary-search-tree/types";
import { defaultCompare } from "../../../comparator";
import { tests as dataStructureTests } from "./data-structure";

export const tests = <T>(
  Structure: BinarySearchTreeConstructor<T>,
  initArgs: T[]
): TestSuite => {
  const sortedArgs = Array.from(new Set(initArgs)).sort(defaultCompare);

  return {
    ...dataStructureTests(Structure, sortedArgs),

    comparator({ it }): void {
      it(() => {
        const tree1 = new Structure();
        expect(tree1.comparator).toBeDefined();
        expect(tree1.comparator.compare).toBe(defaultCompare);

        const compare = (a: T, b: T) => (a === b ? 0 : a < b ? -1 : 1);
        const tree2 = new Structure(undefined, compare);
        expect(tree2.comparator.compare).toBe(compare);
      });
    },

    insert(): void {
      it("inserting", () => {
        const compare = (a: T, b: T) => (a === b ? 0 : a > b ? -1 : 1);
        const tree = new Structure(undefined, compare);
        initArgs.forEach((arg) => tree.insert(arg));
        expect(Array.from(tree)).toEqual([...sortedArgs].reverse());
      });
    },

    remove(): void {
      it("removing", () => {
        const tree = new Structure(initArgs);

        expect(Array.from(tree)).toEqual(sortedArgs);

        function shuffle(a: T[]): T[] {
          let j;
          let x;
          let i;
          for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
          }
          return a;
        }

        const values = new Set(sortedArgs);
        const args = shuffle(initArgs.slice());

        for (const value of args) {
          if (values.has(value)) {
            expect(tree.remove(value)).toBe(true);
            values.delete(value);
          } else {
            expect(tree.remove(value)).toBe(false);
          }

          expect(Array.from(tree)).toEqual([...values].sort(defaultCompare));
        }

        expect(Array.from(tree)).toEqual([]);
      });

      it("removing (unbalancing)", () => {
        const tree = new Structure(initArgs);

        expect(Array.from(tree)).toEqual(sortedArgs);

        tree.remove(sortedArgs[0]);
        tree.remove(sortedArgs[1]);
        tree.remove(sortedArgs[2]);

        expect(Array.from(tree)).toEqual(sortedArgs.slice(3));
      });
    },

    has(): void {
      it("testing", () => {
        const tree = new Structure(initArgs);
        initArgs.forEach((arg) => {
          expect(tree.has(arg)).toBe(true);
        });

        if (typeof initArgs[0] === "number") {
          const max = initArgs.reduce((n: number, a: T) => {
            if (typeof a === "number") {
              return n > Math.abs(a) ? n : Math.abs(a);
            }
            return n;
          }, 0);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((tree as any).has(max + 1)).toBe(false);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((tree as any).has(-max - 1)).toBe(false);
        }
      });
    },

    _insert({ it }): void {
      it(() => {
        const compare = (a: T, b: T) => (a === b ? 0 : a > b ? -1 : 1);
        const tree = new Structure(undefined, compare);
        const nodes = initArgs.map((arg) => tree._insert(arg));
        expect(Array.from(tree)).toEqual([...sortedArgs].reverse());

        const values = new Set(initArgs);
        nodes.forEach((node, i) => {
          const value = initArgs[i];
          if (node === null) {
            expect(values.has(value)).toBe(false);
          } else {
            expect(node.value).toBe(value);
          }
          values.delete(value);
        });
      });
    },

    _remove({ it }): void {
      it(() => {
        const compare = (a: T, b: T) => (a === b ? 0 : a < b ? -1 : 1);
        const tree = new Structure(undefined, compare);
        const nodes = initArgs.map((arg) => tree._insert(arg));
        expect(Array.from(tree)).toEqual(sortedArgs);

        const values = new Set(initArgs);

        initArgs.forEach((value, i) => {
          const node = nodes[i];

          if (node === null) {
            expect(tree._remove(value)).toBe(null);
          } else {
            const node2 = tree._remove(value);
            expect(node2).not.toBeNull();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expect(tree.comparator.lessThanOrEqual(value, node2!.value)).toBe(
              true
            );
          }
          values.delete(value);
        });
      });
    },

    dftNodeIterate(): void {
      it("Depth first traversal", () => {
        let tree = new Structure(initArgs);

        expect(
          Array.from(tree.dftNodeIterate()).map((node) => node.value)
        ).toEqual(sortedArgs);

        tree = new Structure(sortedArgs);
        let parent: BinarySearchTreeNode<T> | null = null;

        Array.from(tree.dftNodeIterate()).forEach((node, i) => {
          expect(node.parent).toBe(parent);
          expect(node.left).toBeNull();
          if (i < sortedArgs.length - 1) {
            expect(node.right).not.toBeNull();
          } else {
            expect(node.right).toBeNull();
          }
          parent = node;
        });

        tree = new Structure([...sortedArgs].reverse());
        let left: BinarySearchTreeNode<T> | null = null;

        Array.from(tree.dftNodeIterate()).forEach((node, i) => {
          expect(node.left).toBe(left);
          expect(node.right).toBeNull();
          if (i < sortedArgs.length - 1) {
            expect(node.parent).not.toBeNull();
          } else {
            expect(node.parent).toBeNull();
          }
          left = node;
        });
      });
    },

    root: false, // protected
  };
};
