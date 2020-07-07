import { TestSuite } from "../../../testsuite";
import { BinaryTreeNodeConstructor } from "../../tree/types";
import { Comparator } from "../../../comparator";

export const tests = <T>(
  Structure: BinaryTreeNodeConstructor<T>
): TestSuite => ({
  value(): void {
    it("initializing with integers", () => {
      const comparator = new Comparator<number>();

      const node1 = new Structure(1, comparator);
      const node2 = new Structure(2, comparator);

      expect(node1.value).toBe(1);
      expect(node1.parent).toBeNull();
      expect(node1.left).toBeNull();
      expect(node1.right).toBeNull();
      expect(node1.root).toBe(node1);

      expect(node2.value).toBe(2);
      expect(node2.parent).toBeNull();
      expect(node2.left).toBeNull();
      expect(node2.right).toBeNull();
      expect(node2.root).toBe(node2);
    });

    it("initializing with objects", () => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);

      expect(node1.value).toBe(o1);
      expect(node1.parent).toBeNull();
      expect(node1.left).toBeNull();
      expect(node1.right).toBeNull();
      expect(node1.root).toBe(node1);

      expect(node2.value).toBe(o2);
      expect(node2.parent).toBeNull();
      expect(node2.left).toBeNull();
      expect(node2.right).toBeNull();
      expect(node2.root).toBe(node2);
    });
  },

  comparator({ it }): void {
    it(() => {
      const comparator = new Comparator<number>();

      const node1 = new Structure(1, comparator);
      const node2 = new Structure(2, comparator);

      expect(node1.comparator).toBe(comparator);
      expect(node2.comparator).toBe(comparator);
    });
  },

  left(): void {
    it("linking", () => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);

      node1.left = node2;
      node1.right = node3;

      expect(node1.value).toBe(o1);
      expect(node1.parent).toBeNull();
      expect(node1.left).toBe(node2);
      expect(node1.right).toBe(node3);
      expect(node1.root).toBe(node1);

      expect(node2.value).toBe(o2);
      expect(node2.parent).toBe(node1);
      expect(node2.left).toBeNull();
      expect(node2.right).toBeNull();
      expect(node2.root).toBe(node1);

      expect(node3.value).toBe(o3);
      expect(node3.parent).toBe(node1);
      expect(node3.left).toBeNull();
      expect(node3.right).toBeNull();
      expect(node3.root).toBe(node1);
    });
  },

  removeChild(): void {
    it("unlinking", () => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);

      node1.left = node2;
      node1.right = node3;

      node1.removeChild(node2);

      expect(node1.value).toBe(o1);
      expect(node1.parent).toBeNull();
      expect(node1.left).toBeNull();
      expect(node1.right).toBe(node3);
      expect(node1.root).toBe(node1);

      expect(node2.value).toBe(o2);
      expect(node2.parent).toBeNull();
      expect(node2.left).toBeNull();
      expect(node2.right).toBeNull();
      expect(node2.root).toBe(node2);

      expect(node3.value).toBe(o3);
      expect(node3.parent).toBe(node1);
      expect(node3.left).toBeNull();
      expect(node3.right).toBeNull();
      expect(node3.root).toBe(node1);
    });
  },

  replaceChild(): void {
    it("relinking", () => {
      const o1 = { a: 1, b: "foo" };
      const o2 = { a: 2, b: "bar" };
      const o3 = { a: 3, b: "qux" };
      const o4 = { a: 4, b: "quux" };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);
      const node4 = new Structure(o4, comparator);

      node1.left = node2;
      node1.right = node3;

      expect(node1.value).toBe(o1);
      expect(node1.parent).toBeNull();
      expect(node1.left).toBe(node2);
      expect(node1.right).toBe(node3);
      expect(node1.root).toBe(node1);

      expect(node2.value).toBe(o2);
      expect(node2.parent).toBe(node1);
      expect(node2.left).toBeNull();
      expect(node2.right).toBeNull();
      expect(node2.root).toBe(node1);

      expect(node3.value).toBe(o3);
      expect(node3.parent).toBe(node1);
      expect(node3.left).toBeNull();
      expect(node3.right).toBeNull();
      expect(node3.root).toBe(node1);

      expect(node4.value).toBe(o4);
      expect(node4.parent).toBeNull();
      expect(node4.left).toBeNull();
      expect(node4.right).toBeNull();
      expect(node4.root).toBe(node4);

      node1.replaceChild(node2, node4);
      node1.replaceChild(node3, node2);

      expect(node1.value).toBe(o1);
      expect(node1.parent).toBeNull();
      expect(node1.left).toBe(node4);
      expect(node1.right).toBe(node2);
      expect(node1.root).toBe(node1);

      expect(node4.value).toBe(o4);
      expect(node4.parent).toBe(node1);
      expect(node4.left).toBeNull();
      expect(node4.right).toBeNull();
      expect(node4.root).toBe(node1);

      expect(node2.value).toBe(o2);
      expect(node2.parent).toBe(node1);
      expect(node2.left).toBeNull();
      expect(node2.right).toBeNull();
      expect(node2.root).toBe(node1);

      expect(node3.value).toBe(o3);
      expect(node3.parent).toBeNull();
      expect(node3.left).toBeNull();
      expect(node3.right).toBeNull();
      expect(node3.root).toBe(node3);
    });
  },

  dftNodeIterate({ it }): void {
    it(() => {
      const o1 = { a: 1 };
      const o2 = { a: 2 };
      const o3 = { a: 3 };
      const o4 = { a: 4 };
      const o5 = { a: 5 };
      const o6 = { a: 6 };
      const o7 = { a: 7 };
      const o8 = { a: 8 };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);
      const node4 = new Structure(o4, comparator);
      const node5 = new Structure(o5, comparator);
      const node6 = new Structure(o6, comparator);
      const node7 = new Structure(o7, comparator);
      const node8 = new Structure(o8, comparator);

      node3.left = node1;
      node1.right = node2;
      node3.right = node4;
      node4.right = node6;
      node6.left = node5;
      node6.right = node8;
      node8.left = node7;

      expect(
        Array.from(node3.dftNodeIterate()).map((node) => node.value)
      ).toEqual([o1, o2, o3, o4, o5, o6, o7, o8]);

      expect(
        Array.from(node1.dftNodeIterate()).map((node) => node.value)
      ).toEqual([o1, o2]);

      expect(
        Array.from(node2.dftNodeIterate()).map((node) => node.value)
      ).toEqual([o2]);

      expect(
        Array.from(node4.dftNodeIterate()).map((node) => node.value)
      ).toEqual([o4, o5, o6, o7, o8]);

      expect(
        Array.from(node6.dftNodeIterate()).map((node) => node.value)
      ).toEqual([o5, o6, o7, o8]);

      expect(
        Array.from(node5.dftNodeIterate()).map((node) => node.value)
      ).toEqual([o5]);

      expect(
        Array.from(node8.dftNodeIterate()).map((node) => node.value)
      ).toEqual([o7, o8]);

      expect(
        Array.from(node7.dftNodeIterate()).map((node) => node.value)
      ).toEqual([o7]);
    });
  },

  dftNodeIterateWithDepth({ it }): void {
    it(() => {
      const o1 = { a: 1 };
      const o2 = { a: 2 };
      const o3 = { a: 3 };
      const o4 = { a: 4 };
      const o5 = { a: 5 };
      const o6 = { a: 6 };
      const o7 = { a: 7 };
      const o8 = { a: 8 };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);
      const node4 = new Structure(o4, comparator);
      const node5 = new Structure(o5, comparator);
      const node6 = new Structure(o6, comparator);
      const node7 = new Structure(o7, comparator);
      const node8 = new Structure(o8, comparator);

      node3.left = node1;
      node1.right = node2;
      node3.right = node4;
      node4.right = node6;
      node6.left = node5;
      node6.right = node8;
      node8.left = node7;

      const d1 = { node: o1, depth: 1 };
      const d2 = { node: o2, depth: 2 };
      const d3 = { node: o3, depth: 0 };
      const d4 = { node: o4, depth: 1 };
      const d5 = { node: o5, depth: 3 };
      const d6 = { node: o6, depth: 2 };
      const d7 = { node: o7, depth: 4 };
      const d8 = { node: o8, depth: 3 };

      expect(
        Array.from(node3.dftNodeIterateWithDepth()).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d1, d2, d3, d4, d5, d6, d7, d8]);

      expect(
        Array.from(node1.dftNodeIterateWithDepth(1)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d1, d2]);

      expect(
        Array.from(node2.dftNodeIterateWithDepth(2)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d2]);

      expect(
        Array.from(node4.dftNodeIterateWithDepth(1)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d4, d5, d6, d7, d8]);

      expect(
        Array.from(node6.dftNodeIterateWithDepth(2)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d5, d6, d7, d8]);

      expect(
        Array.from(node5.dftNodeIterateWithDepth(3)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d5]);

      expect(
        Array.from(node8.dftNodeIterateWithDepth(3)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d7, d8]);

      expect(
        Array.from(node7.dftNodeIterateWithDepth(4)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d7]);
    });
  },

  bftNodeIterate({ it }): void {
    it(() => {
      const o1 = { a: 1 };
      const o2 = { a: 2 };
      const o3 = { a: 3 };
      const o4 = { a: 4 };
      const o5 = { a: 5 };
      const o6 = { a: 6 };
      const o7 = { a: 7 };
      const o8 = { a: 8 };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);
      const node4 = new Structure(o4, comparator);
      const node5 = new Structure(o5, comparator);
      const node6 = new Structure(o6, comparator);
      const node7 = new Structure(o7, comparator);
      const node8 = new Structure(o8, comparator);

      node3.left = node1;
      node1.right = node2;
      node3.right = node4;
      node4.right = node6;
      node6.left = node5;
      node6.right = node8;
      node8.left = node7;

      expect(
        Array.from(node3.bftNodeIterate()).map((node) => node.value)
      ).toEqual([o3, o1, o4, o2, o6, o5, o8, o7]);

      expect(
        Array.from(node1.bftNodeIterate()).map((node) => node.value)
      ).toEqual([o1, o2]);

      expect(
        Array.from(node2.bftNodeIterate()).map((node) => node.value)
      ).toEqual([o2]);

      expect(
        Array.from(node4.bftNodeIterate()).map((node) => node.value)
      ).toEqual([o4, o6, o5, o8, o7]);

      expect(
        Array.from(node6.bftNodeIterate()).map((node) => node.value)
      ).toEqual([o6, o5, o8, o7]);

      expect(
        Array.from(node5.bftNodeIterate()).map((node) => node.value)
      ).toEqual([o5]);

      expect(
        Array.from(node8.bftNodeIterate()).map((node) => node.value)
      ).toEqual([o8, o7]);

      expect(
        Array.from(node7.bftNodeIterate()).map((node) => node.value)
      ).toEqual([o7]);
    });
  },

  bftNodeIterateWithDepth({ it }): void {
    it(() => {
      const o1 = { a: 1 };
      const o2 = { a: 2 };
      const o3 = { a: 3 };
      const o4 = { a: 4 };
      const o5 = { a: 5 };
      const o6 = { a: 6 };
      const o7 = { a: 7 };
      const o8 = { a: 8 };

      const comparator = new Comparator<typeof o1>((o1, o2) =>
        o1.a === o2.a ? 0 : o1.a < o2.a ? -1 : 1
      );

      const node1 = new Structure(o1, comparator);
      const node2 = new Structure(o2, comparator);
      const node3 = new Structure(o3, comparator);
      const node4 = new Structure(o4, comparator);
      const node5 = new Structure(o5, comparator);
      const node6 = new Structure(o6, comparator);
      const node7 = new Structure(o7, comparator);
      const node8 = new Structure(o8, comparator);

      node3.left = node1;
      node1.right = node2;
      node3.right = node4;
      node4.right = node6;
      node6.left = node5;
      node6.right = node8;
      node8.left = node7;

      const d1 = { node: o1, depth: 1 };
      const d2 = { node: o2, depth: 2 };
      const d3 = { node: o3, depth: 0 };
      const d4 = { node: o4, depth: 1 };
      const d5 = { node: o5, depth: 3 };
      const d6 = { node: o6, depth: 2 };
      const d7 = { node: o7, depth: 4 };
      const d8 = { node: o8, depth: 3 };

      expect(
        Array.from(node3.bftNodeIterateWithDepth()).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d3, d1, d4, d2, d6, d5, d8, d7]);

      expect(
        Array.from(node1.bftNodeIterateWithDepth(1)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d1, d2]);

      expect(
        Array.from(node2.bftNodeIterateWithDepth(2)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d2]);

      expect(
        Array.from(node4.bftNodeIterateWithDepth(1)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d4, d6, d5, d8, d7]);

      expect(
        Array.from(node6.bftNodeIterateWithDepth(2)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d6, d5, d8, d7]);

      expect(
        Array.from(node5.bftNodeIterateWithDepth(3)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d5]);

      expect(
        Array.from(node8.bftNodeIterateWithDepth(3)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d8, d7]);

      expect(
        Array.from(node7.bftNodeIterateWithDepth(4)).map(({ node, depth }) => ({
          node: node.value,
          depth,
        }))
      ).toEqual([d7]);
    });
  },

  right: false, // see left
  parent: false, // see left
  root: false, // see left
});

export const staticTests = <T>({
  length,
  name,
  Structure,
}: {
  length: number;
  name: string;
  Structure: BinaryTreeNodeConstructor<T>;
}): TestSuite => ({
  length({ it }) {
    it(() => {
      expect(Structure.length).toBe(length);
    });
  },

  name({ it }) {
    it(() => {
      expect(Structure.name).toBe(name);
    });
  },
});
