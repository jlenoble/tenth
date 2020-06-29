import { makeTestSuite, TestSuite } from "../../../testsuite";
import { LinkedList } from "../linked-list";
import { SizedLinkedList } from "../sized-linked-list";
import { LinkedListConstructor } from "../types";

const tests = (LinkedList: LinkedListConstructor<number>): TestSuite => ({
  size(): void {
    it("reading size", () => {
      const l = new LinkedList();
      l.append(1).append(2).append(3);

      expect(l.size).toBe(3);
    });
  },

  head(): void {
    it("reading head", () => {
      const l = new LinkedList();
      l.append(1).append(2).append(3);

      expect(l.head).toBe(1);
    });
  },

  tail(): void {
    it("reading head", () => {
      const l = new LinkedList();
      l.append(1).append(2).append(3);

      expect(l.tail).toBe(3);
    });
  },

  append(): void {
    it("appending", () => {
      const l = new LinkedList();

      l.append(1);

      expect(l.size).toBe(1);
      expect(Array.from(l)).toEqual([1]);

      l.append(2).append(3);

      expect(l.size).toBe(3);
      expect(Array.from(l)).toEqual([1, 2, 3]);

      l.append(2).append(1).append(0);

      expect(l.size).toBe(6);
      expect(Array.from(l)).toEqual([1, 2, 3, 2, 1, 0]);
    });
  },

  prepend(): void {
    it("prepending", () => {
      const l = new LinkedList();

      l.prepend(1);

      expect(l.size).toBe(1);
      expect(Array.from(l)).toEqual([1]);

      l.prepend(2).prepend(3);
      expect(Array.from(l)).toEqual([3, 2, 1]);

      expect(l.size).toBe(3);

      l.prepend(2).prepend(1).prepend(0);
      expect(Array.from(l)).toEqual([0, 1, 2, 3, 2, 1]);

      expect(l.size).toBe(6);
    });
  },

  deleteHead(): void {
    it("deleting head", () => {
      const l = new LinkedList();
      l.append(1).append(2).append(3);

      expect(l.size).toBe(3);
      expect(Array.from(l)).toEqual([1, 2, 3]);

      const n1 = l.deleteHead();

      expect(l.size).toBe(2);
      expect(Array.from(l)).toEqual([2, 3]);
      expect(n1?.value).toBe(1);

      const n2 = l.deleteHead();
      const n3 = l.deleteHead();

      expect(l.size).toBe(0);
      expect(Array.from(l)).toEqual([]);
      expect(n2?.value).toBe(2);
      expect(n3?.value).toBe(3);

      const n4 = l.deleteHead();

      expect(l.size).toBe(0);
      expect(Array.from(l)).toEqual([]);
      expect(n4).toBeNull();
    });
  },

  deleteTail(): void {
    it("deleting tail", () => {
      const l = new LinkedList();
      l.append(1).append(2).append(3);

      expect(l.size).toBe(3);
      expect(Array.from(l)).toEqual([1, 2, 3]);

      const n1 = l.deleteTail();

      expect(l.size).toBe(2);
      expect(Array.from(l)).toEqual([1, 2]);
      expect(n1?.value).toBe(3);

      const n2 = l.deleteTail();
      const n3 = l.deleteTail();

      expect(l.size).toBe(0);
      expect(Array.from(l)).toEqual([]);
      expect(n2?.value).toBe(2);
      expect(n3?.value).toBe(1);

      const n4 = l.deleteTail();

      expect(l.size).toBe(0);
      expect(Array.from(l)).toEqual([]);
      expect(n4).toBeNull();
    });
  },
});

const staticTests = (LinkedList: LinkedListConstructor<number>): TestSuite => ({
  length({ it }) {
    it(() => {
      expect(LinkedList.length).toBe(0);
    });
  },

  name({ it }) {
    it(() => {
      if (LinkedList.name.includes("Sized")) {
        expect(LinkedList.name).toBe("SizedLinkedList");
      } else {
        expect(LinkedList.name).toBe("LinkedList");
      }
    });
  },
});

makeTestSuite(LinkedList, tests(LinkedList), staticTests(LinkedList));
makeTestSuite(
  SizedLinkedList,
  tests(SizedLinkedList),
  staticTests(SizedLinkedList)
);
