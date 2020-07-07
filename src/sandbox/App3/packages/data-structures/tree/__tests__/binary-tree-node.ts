import { makeTestSuite } from "../../../testsuite";
import { BinaryTreeNode } from "../binary-tree-node";
import { Comparator } from "../../../comparator";

makeTestSuite(
  BinaryTreeNode,
  {
    value(): void {
      it("initializing with integers", () => {
        const comparator = new Comparator<number>();

        const node1 = new BinaryTreeNode(1, comparator);
        const node2 = new BinaryTreeNode(2, comparator);

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

        const node1 = new BinaryTreeNode(o1, comparator);
        const node2 = new BinaryTreeNode(o2, comparator);

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

        const node1 = new BinaryTreeNode(1, comparator);
        const node2 = new BinaryTreeNode(2, comparator);

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

        const node1 = new BinaryTreeNode(o1, comparator);
        const node2 = new BinaryTreeNode(o2, comparator);
        const node3 = new BinaryTreeNode(o3, comparator);

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

        const node1 = new BinaryTreeNode(o1, comparator);
        const node2 = new BinaryTreeNode(o2, comparator);
        const node3 = new BinaryTreeNode(o3, comparator);

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

        const node1 = new BinaryTreeNode(o1, comparator);
        const node2 = new BinaryTreeNode(o2, comparator);
        const node3 = new BinaryTreeNode(o3, comparator);
        const node4 = new BinaryTreeNode(o4, comparator);

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

    right: false, // see left
    parent: false, // see left
    root: false, // see left
  },
  {
    length({ it }): void {
      it(() => {
        expect(BinaryTreeNode.length).toEqual(2);
      });
    },

    name({ it }): void {
      it(() => {
        expect(BinaryTreeNode.name).toEqual("BinaryTreeNode");
      });
    },
  }
);
