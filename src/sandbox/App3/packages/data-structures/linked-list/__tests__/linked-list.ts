import { makeTestSuite } from "../../../testsuite";
import { LinkedList } from "../linked-list";

makeTestSuite(LinkedList, {
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

      l.deleteHead();

      expect(l.size).toBe(2);
      expect(Array.from(l)).toEqual([2, 3]);

      l.deleteHead();
      l.deleteHead();

      expect(l.size).toBe(0);
      expect(Array.from(l)).toEqual([]);

      l.deleteHead();

      expect(l.size).toBe(0);
      expect(Array.from(l)).toEqual([]);
    });
  },

  deleteTail(): void {
    it("deleting tail", () => {
      const l = new LinkedList();
      l.append(1).append(2).append(3);

      expect(l.size).toBe(3);
      expect(Array.from(l)).toEqual([1, 2, 3]);

      l.deleteTail();

      expect(l.size).toBe(2);
      expect(Array.from(l)).toEqual([1, 2]);

      l.deleteTail();
      l.deleteTail();

      expect(l.size).toBe(0);
      expect(Array.from(l)).toEqual([]);

      l.deleteTail();

      expect(l.size).toBe(0);
      expect(Array.from(l)).toEqual([]);
    });
  },
});

describe("LinkedList", () => {
  it("empty on creation", () => {
    const l = new LinkedList();

    expect(l.head).toBeNull();
    expect(l.tail).toBeNull();
    expect(l.size).toBe(0);
  });
});
