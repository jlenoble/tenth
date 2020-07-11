import { TestSuite } from "../../../testsuite";
import { AvlTreeConstructor, AvlTreeNode } from "../../tree/avl-tree/types";
import { defaultCompare } from "../../../comparator";
import { tests as binarySearchTreeTests } from "./binary-search-tree";

export const tests = <T>(
  Structure: AvlTreeConstructor<T>,
  initArgs: T[],
  balancedArgs: T[]
): TestSuite => {
  const sortedArgs = Array.from(new Set(initArgs)).sort(defaultCompare);

  return {
    ...binarySearchTreeTests(Structure, sortedArgs),

    dftNodeIterate(): void {
      it("Depth first traversal", () => {
        let tree = new Structure(initArgs);

        expect(
          Array.from(tree.dftNodeIterate()).map((node) => node.value)
        ).toEqual(sortedArgs);

        tree = new Structure(sortedArgs);

        expect(
          Array.from(tree.dftNodeIterate()).map((node) => node.value)
        ).toEqual(sortedArgs);

        tree = new Structure([...sortedArgs].reverse());

        expect(
          Array.from(tree.dftNodeIterate()).map((node) => node.value)
        ).toEqual(sortedArgs);
      });
    },

    rotateRightRight(): void {
      it("atomic RR", () => {
        const tree = new Structure();

        expect(sortedArgs.length).toBeGreaterThanOrEqual(3);

        const args = sortedArgs.slice(0, 3);

        tree.insert(args[0]);
        tree.insert(args[1]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[0], args[1]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 2));

        tree.insert(args[2]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[0], args[2]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0, 0]);
        expect(Array.from(tree)).toEqual(args);
      });

      it("Balanced insert", () => {
        const tree = new Structure();

        expect(sortedArgs.length).toBeGreaterThanOrEqual(6);

        const args = sortedArgs.slice(0, 6);

        tree.insert(args[3]);
        tree.insert(args[1]);
        tree.insert(args[4]);
        tree.insert(args[0]);
        tree.insert(args[2]);
        tree.insert(args[5]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[3], args[1], args[4], args[0], args[2], args[5]]);
      });

      it("Right only insert", () => {
        const tree = new Structure();

        expect(sortedArgs.length).toBeGreaterThanOrEqual(7);

        const args = sortedArgs.slice(0, 7);

        tree.insert(args[0]);
        tree.insert(args[1]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[0], args[1]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 2));

        tree.insert(args[2]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[0], args[2]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 3));

        tree.insert(args[3]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[0], args[2], args[3]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([2, 0, 1, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 4));

        tree.insert(args[4]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[0], args[3], args[2], args[4]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([2, 0, 1, 0, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 5));

        tree.insert(args[5]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[3], args[1], args[4], args[0], args[2], args[5]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([2, 1, 1, 0, 0, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 6));

        tree.insert(args[6]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([
          args[3],
          args[1],
          args[5],
          args[0],
          args[2],
          args[4],
          args[6],
        ]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([2, 1, 1, 0, 0, 0, 0]);
        expect(Array.from(tree)).toEqual(args);
      });
    },

    rotateLeftLeft(): void {
      it("atomic LL", () => {
        const tree = new Structure();

        expect(sortedArgs.length).toBeGreaterThanOrEqual(3);

        const args = sortedArgs.slice(0, 3);

        tree.insert(args[2]);
        tree.insert(args[1]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[2], args[1]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0]);
        expect(Array.from(tree)).toEqual(args.slice(1, 3));

        tree.insert(args[0]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[0], args[2]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0, 0]);
        expect(Array.from(tree)).toEqual(args);
      });

      it("Left only insert", () => {
        const tree = new Structure();

        expect(sortedArgs.length).toBeGreaterThanOrEqual(7);

        const args = sortedArgs.slice(0, 7).reverse();

        tree.insert(args[0]);
        tree.insert(args[1]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[0], args[1]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 2).reverse());

        tree.insert(args[2]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[2], args[0]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 3).reverse());

        tree.insert(args[3]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[2], args[0], args[3]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([2, 1, 0, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 4).reverse());

        tree.insert(args[4]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[3], args[0], args[4], args[2]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([2, 1, 0, 0, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 5).reverse());

        tree.insert(args[5]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[3], args[4], args[1], args[5], args[2], args[0]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([2, 1, 1, 0, 0, 0]);
        expect(Array.from(tree)).toEqual(args.slice(0, 6).reverse());

        tree.insert(args[6]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([
          args[3],
          args[5],
          args[1],
          args[6],
          args[4],
          args[2],
          args[0],
        ]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([2, 1, 1, 0, 0, 0, 0]);
        expect(Array.from(tree)).toEqual(args.reverse());
      });
    },

    rotateLeftRight(): void {
      it("atomic LR", () => {
        const tree = new Structure();

        expect(sortedArgs.length).toBeGreaterThanOrEqual(3);

        const args = sortedArgs.slice(0, 3);

        tree.insert(args[2]);
        tree.insert(args[0]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[2], args[0]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0]);
        expect(Array.from(tree)).toEqual([args[0], args[2]]);

        tree.insert(args[1]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[0], args[2]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0, 0]);
        expect(Array.from(tree)).toEqual(args);
      });

      it("deep LR (imbalancing)", () => {
        const tree = new Structure(balancedArgs);
        const sortedArgs = balancedArgs.slice().sort(defaultCompare);
        const balancedRows: T[][] = [];

        let min = 0;
        let max = 1;
        const l = balancedArgs.length;
        while (max < l) {
          balancedRows.push(
            balancedArgs.slice(min, min + max).sort(defaultCompare)
          );
          min = min + max;
          max *= 2;
        }

        expect(
          Array.from(tree.bftNodeIterate()).map((node) => node.value)
        ).toEqual(balancedRows.reduce((r1, r2) => r1.concat(r2)));
        expect(Array.from(tree)).toEqual(sortedArgs);

        tree.remove(sortedArgs[0]);
        tree.remove(sortedArgs[4]);
        tree.remove(sortedArgs[6]);
        tree.remove(sortedArgs[5]);

        const newRows: T[][] = [];

        for (const {
          node: { value },
          depth,
        } of tree.bftNodeIterateWithDepth()) {
          const newRow = newRows[depth] || [];
          if (!newRows[depth]) {
            newRows[depth] = newRow;
          }
          newRow.push(value);
        }

        expect(newRows[newRows.length - 1]).toEqual(
          balancedRows[balancedRows.length - 1].slice(4)
        );
        expect(newRows[newRows.length - 2]).toEqual(
          [sortedArgs[1], sortedArgs[3]].concat(
            balancedRows[balancedRows.length - 2].slice(2)
          )
        );
        expect(newRows[newRows.length - 3]).toEqual(
          [sortedArgs[2]].concat(balancedRows[balancedRows.length - 3].slice(1))
        );
      });
    },

    rotateRightLeft(): void {
      it("atomic RL", () => {
        const tree = new Structure();

        expect(sortedArgs.length).toBeGreaterThanOrEqual(3);

        const args = sortedArgs.slice(0, 3);

        tree.insert(args[0]);
        tree.insert(args[2]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[0], args[2]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0]);
        expect(Array.from(tree)).toEqual([args[0], args[2]]);

        tree.insert(args[1]);

        expect(
          Array.from(tree.bftNodeIterate()).map(({ value }) => value)
        ).toEqual([args[1], args[0], args[2]]);
        expect(
          Array.from(tree.bftNodeIterate()).map(
            (node) => (node as AvlTreeNode<T>).height
          )
        ).toEqual([1, 0, 0]);
        expect(Array.from(tree)).toEqual(args);
      });
    },

    bftNodeIterate(): void {
      it("Breadth first traversal", () => {
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
          Array.from(tree.bftNodeIterate()).map((node) => node.value)
        ).toEqual([args[2], args[1], args[4], args[0], args[3], args[5]]);
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
          [args[2], args[1], args[4], args[0], args[3], args[5]].reverse()
        );
      });
    },

    balance: false, // cf. internally called by every tests
    height: false, // cf. rotateRightRight "Right only insert"
  };
};
