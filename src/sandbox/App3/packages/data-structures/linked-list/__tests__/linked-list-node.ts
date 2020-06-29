import { makeTestSuite } from "../../../testsuite";
import { LinkedListNode } from "../linked-list-node";

makeTestSuite(
  LinkedListNode,
  {
    value(): void {
      it("initializing with integers", () => {
        const node1 = new LinkedListNode(1);
        const node2 = new LinkedListNode(2);

        expect(node1.value).toBe(1);
        expect(node1.next).toBeNull();

        expect(node2.value).toBe(2);
        expect(node2.next).toBeNull();
      });

      it("initializing with objects", () => {
        const o1 = { a: 1, b: "foo" };
        const o2 = { a: 2, b: "bar" };
        const node1 = new LinkedListNode(o1);
        const node2 = new LinkedListNode(o2);

        expect(node1.value).toBe(o1);
        expect(node1.next).toBeNull();

        expect(node2.value).toBe(o2);
        expect(node2.next).toBeNull();
      });
    },

    next(): void {
      it("linking", () => {
        const o1 = { a: 1, b: "foo" };
        const o2 = { a: 2, b: "bar" };
        const o3 = { a: 3, b: "qux" };

        const node3 = new LinkedListNode(o3);
        const node2 = new LinkedListNode(o2, node3);
        const node1 = new LinkedListNode(o1, node2);

        expect(node1.next).toBeDefined();
        expect(node2.next).toBeDefined();
        expect(node3.next).toBeDefined();

        expect(node1.next).toBe(node2);
        expect(node2.next).toBe(node3);
        expect(node3.next).toBeNull();

        expect(node1.value).toBe(o1);
        expect(node2.value).toBe(o2);
        expect(node3.value).toBe(o3);
      });
    },
  },
  {
    length({ it }): void {
      it(() => {
        expect(LinkedListNode.length).toEqual(1);
      });
    },

    name({ it }): void {
      it(() => {
        expect(LinkedListNode.name).toEqual("LinkedListNode");
      });
    },
  }
);
