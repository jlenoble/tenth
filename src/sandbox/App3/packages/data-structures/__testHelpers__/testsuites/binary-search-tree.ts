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

    rdftNodeIterate(): void {
      it("Reverse depth first traversal", () => {
        const tree = new Structure(initArgs);

        expect(
          Array.from(tree.rdftNodeIterate()).map((node) => node.value)
        ).toEqual(sortedArgs.slice().reverse());
      });
    },

    bftNodeIterate(): void {
      it("Breadth first traversal", () => {
        let tree = new Structure(sortedArgs);
        let parent: BinarySearchTreeNode<T> | null = null;

        Array.from(tree.bftNodeIterate()).forEach((node, i) => {
          expect(node.parent).toBe(parent);
          expect(node.left).toBeNull();
          if (i < sortedArgs.length - 1) {
            expect(node.right).not.toBeNull();
          } else {
            expect(node.right).toBeNull();
          }
          parent = node;
        });

        expect(Array.from(tree)).toEqual(sortedArgs);
        expect(
          Array.from(tree.bftNodeIterate()).map((node) => node.value)
        ).toEqual(sortedArgs);

        tree = new Structure([...sortedArgs].reverse());
        parent = null;

        Array.from(tree.bftNodeIterate()).forEach((node, i) => {
          expect(node.parent).toBe(parent);
          expect(node.right).toBeNull();
          if (i < sortedArgs.length - 1) {
            expect(node.left).not.toBeNull();
          } else {
            expect(node.left).toBeNull();
          }
          parent = node;
        });

        expect(Array.from(tree)).toEqual(sortedArgs);
        expect(
          Array.from(tree.bftNodeIterate()).map((node) => node.value)
        ).toEqual([...sortedArgs].reverse());

        expect(sortedArgs.length).toBeGreaterThanOrEqual(6);

        const args = sortedArgs.slice(0, 6);

        tree = new Structure();

        tree.insert(args[3]);
        tree.insert(args[1]);
        tree.insert(args[4]);
        tree.insert(args[0]);
        tree.insert(args[2]);
        tree.insert(args[5]);

        expect(Array.from(tree)).toEqual(args);
        expect(
          Array.from(tree.bftNodeIterate()).map((node) => node.value)
        ).toEqual([args[3], args[1], args[4], args[0], args[2], args[5]]);

        tree = new Structure();

        tree.insert(args[2]);
        tree.insert(args[3]);
        tree.insert(args[1]);
        tree.insert(args[5]);
        tree.insert(args[0]);
        tree.insert(args[4]);

        expect(Array.from(tree)).toEqual(args);
        expect(
          Array.from(tree.bftNodeIterate()).map((node) => node.value)
        ).toEqual([args[2], args[1], args[3], args[0], args[5], args[4]]);
      });
    },

    rbftNodeIterate(): void {
      it("Reverse breadth first traversal", () => {
        const tree = new Structure();
        const args = sortedArgs.slice(0, 6);

        tree.insert(args[2]);
        tree.insert(args[3]);
        tree.insert(args[1]);
        tree.insert(args[5]);
        tree.insert(args[0]);
        tree.insert(args[4]);

        expect(Array.from(tree)).toEqual(args);
        expect(
          Array.from(tree.rbftNodeIterate()).map((node) => node.value)
        ).toEqual(
          [args[2], args[1], args[3], args[0], args[5], args[4]].reverse()
        );
      });
    },

    // return type is an artefact to please typescript
    toString(): string {
      it("testing toString", () => {
        const tree = new Structure();

        expect(sortedArgs.length).toBeGreaterThanOrEqual(6);

        const args = sortedArgs.slice(0, 6);

        tree.insert(args[3]);
        tree.insert(args[1]);
        tree.insert(args[4]);
        tree.insert(args[0]);
        tree.insert(args[2]);
        tree.insert(args[5]);

        expect(tree.toString()).toEqual(
          [
            `└─ ${args[3]}`,
            `   ├─ L:${args[1]}`,
            `   │  ├─ L:${args[0]}`,
            `   │  └─ R:${args[2]}`,
            `   └─ R:${args[4]}`,
            `      ├─ L:null`,
            `      └─ R:${args[5]}\n`,
          ].join("\n")
        );

        expect(tree.toString((node) => !!node.parent)).toEqual(
          [
            "└─ false",
            "   ├─ L:true",
            "   │  ├─ L:true",
            "   │  └─ R:true",
            "   └─ R:true",
            "      ├─ L:null",
            "      └─ R:true\n",
          ].join("\n")
        );

        expect(tree.toString((node) => !!node.left)).toEqual(
          [
            "└─ true",
            "   ├─ L:true",
            "   │  ├─ L:false",
            "   │  └─ R:false",
            "   └─ R:false",
            "      ├─ L:null",
            "      └─ R:false\n",
          ].join("\n")
        );

        expect(tree.toString((node) => !!node.right)).toEqual(
          [
            "└─ true",
            "   ├─ L:true",
            "   │  ├─ L:false",
            "   │  └─ R:false",
            "   └─ R:true",
            "      ├─ L:null",
            "      └─ R:false\n",
          ].join("\n")
        );
      });

      return "";
    },

    root: false, // protected
  };
};
