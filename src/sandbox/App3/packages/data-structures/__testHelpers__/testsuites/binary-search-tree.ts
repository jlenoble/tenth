import { TestSuite } from "../../../testsuite";
import { BinarySearchTreeConstructor } from "../../tree/binary-search-tree/types";
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

    root: false, // protected
  };
};
