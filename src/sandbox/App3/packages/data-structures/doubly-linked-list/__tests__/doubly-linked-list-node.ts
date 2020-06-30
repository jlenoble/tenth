import { makeTestSuite } from "../../../testsuite";
import { DoublyLinkedListNode } from "../doubly-linked-list-node";

makeTestSuite(
  DoublyLinkedListNode,
  {
    value(): void {
      it("initializing with integers", () => {
        const node1 = new DoublyLinkedListNode(1);
        const node2 = new DoublyLinkedListNode(2);

        expect(node1.value).toBe(1);
        expect(node1.previous).toBeNull();
        expect(node1.next).toBeNull();

        expect(node2.value).toBe(2);
        expect(node2.previous).toBeNull();
        expect(node2.next).toBeNull();
      });

      it("initializing with objects", () => {
        const o1 = { a: 1, b: "foo" };
        const o2 = { a: 2, b: "bar" };
        const node1 = new DoublyLinkedListNode(o1);
        const node2 = new DoublyLinkedListNode(o2);

        expect(node1.value).toBe(o1);
        expect(node1.previous).toBeNull();
        expect(node1.next).toBeNull();

        expect(node2.value).toBe(o2);
        expect(node2.previous).toBeNull();
        expect(node2.next).toBeNull();
      });
    },

    previous(): void {
      it("previous after linking", () => {
        const o1 = { a: 1, b: "foo" };
        const o2 = { a: 2, b: "bar" };
        const o3 = { a: 3, b: "qux" };

        const node1 = new DoublyLinkedListNode(o1);
        const node3 = new DoublyLinkedListNode(o3);
        const node2 = new DoublyLinkedListNode(o2, node1, node3);

        node1.next = node2;
        node3.previous = node2;

        expect(node1.previous).toBeDefined();
        expect(node2.previous).toBeDefined();
        expect(node3.previous).toBeDefined();

        expect(node1.previous).toBeNull();
        expect(node2.previous).toBe(node1);
        expect(node3.previous).toBe(node2);

        expect(node1.value).toBe(o1);
        expect(node2.value).toBe(o2);
        expect(node3.value).toBe(o3);
      });
    },

    next(): void {
      it("next after linking", () => {
        const o1 = { a: 1, b: "foo" };
        const o2 = { a: 2, b: "bar" };
        const o3 = { a: 3, b: "qux" };

        const node1 = new DoublyLinkedListNode(o1);
        const node3 = new DoublyLinkedListNode(o3);
        const node2 = new DoublyLinkedListNode(o2, node1, node3);

        node1.next = node2;
        node3.previous = node2;

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
        expect(DoublyLinkedListNode.length).toEqual(1);
      });
    },

    name({ it }): void {
      it(() => {
        expect(DoublyLinkedListNode.name).toEqual("DoublyLinkedListNode");
      });
    },
  }
);
