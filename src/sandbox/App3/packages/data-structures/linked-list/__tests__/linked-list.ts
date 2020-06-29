import { makeTestSuite } from "../../../testsuite";
import { LinkedList } from "../linked-list";

makeTestSuite(LinkedList, {
  append(): void {
    it("appending", () => {
      const l = new LinkedList();

      l.append(1);

      expect(l.size).toBe(1);

      l.append(2).append(3);

      expect(l.size).toBe(3);

      l.append(2).append(1).append(0);

      expect(l.size).toBe(6);
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
