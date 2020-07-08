import { TestSuite } from "../../../testsuite";
import { AvlTreeConstructor, AvlTreeNode } from "../../tree/avl-tree/types";
import { defaultCompare } from "../../../comparator";
import { tests as binarySearchTreeTests } from "./binary-search-tree";

export const tests = <T>(
  Structure: AvlTreeConstructor<T>,
  initArgs: T[]
): TestSuite => {
  const sortedArgs = Array.from(new Set(initArgs)).sort(defaultCompare);

  return {
    ...binarySearchTreeTests(Structure, sortedArgs),

    rotateRightRight(): void {
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

        console.log(tree.toString());

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

        console.log(tree.toString());

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

        console.log(tree.toString());

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

        console.log(tree.toString());

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

        console.log(tree.toString());

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

        console.log(tree.toString());

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
  };
};
