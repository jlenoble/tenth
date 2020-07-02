import { makeTestSuite } from "../../../testsuite";
import { MinHeap } from "../min-heap";
import { heapTests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, -2, 3, -4, 5, -6, 7];

makeTestSuite(
  MinHeap,
  heapTests(MinHeap, initArgs),
  staticTests({
    length: 0,
    name: "MinHeap",
    Structure: MinHeap,
  })
);

describe("MinHeap", () => {
  it("should create an empty min heap", () => {
    const minHeap = new MinHeap();

    expect(minHeap).toBeDefined();
    expect(minHeap.peek()).toBeUndefined();
    expect(minHeap.isEmpty()).toBe(true);
  });

  it("should add items to the heap and heapify it up", () => {
    const minHeap = new MinHeap();

    minHeap.add(5);
    expect(minHeap.isEmpty()).toBe(false);
    expect(minHeap.peek()).toBe(5);
    expect(Array.from(minHeap)).toEqual([5]);

    minHeap.add(3);
    expect(minHeap.peek()).toBe(3);
    expect(Array.from(minHeap)).toEqual([3, 5]);

    minHeap.add(10);
    expect(minHeap.peek()).toBe(3);
    expect(Array.from(minHeap)).toEqual([3, 5, 10]);

    minHeap.add(1);
    expect(minHeap.peek()).toBe(1);
    expect(Array.from(minHeap)).toEqual([1, 3, 10, 5]);

    minHeap.add(1);
    expect(minHeap.peek()).toBe(1);
    expect(Array.from(minHeap)).toEqual([1, 1, 10, 5, 3]);

    expect(minHeap.poll()).toBe(1);
    expect(Array.from(minHeap)).toEqual([1, 3, 10, 5]);

    expect(minHeap.poll()).toBe(1);
    expect(Array.from(minHeap)).toEqual([3, 5, 10]);

    expect(minHeap.poll()).toBe(3);
    expect(Array.from(minHeap)).toEqual([5, 10]);
  });

  it("should poll items from the heap and heapify it down", () => {
    const minHeap = new MinHeap();

    minHeap.add(5);
    minHeap.add(3);
    minHeap.add(10);
    minHeap.add(11);
    minHeap.add(1);

    expect(Array.from(minHeap)).toEqual([1, 3, 10, 11, 5]);

    expect(minHeap.poll()).toBe(1);
    expect(Array.from(minHeap)).toEqual([3, 5, 10, 11]);

    expect(minHeap.poll()).toBe(3);
    expect(Array.from(minHeap)).toEqual([5, 11, 10]);

    expect(minHeap.poll()).toBe(5);
    expect(Array.from(minHeap)).toEqual([10, 11]);

    expect(minHeap.poll()).toBe(10);
    expect(Array.from(minHeap)).toEqual([11]);

    expect(minHeap.poll()).toBe(11);
    expect(Array.from(minHeap)).toEqual([]);

    expect(minHeap.poll()).toBeUndefined();
    expect(Array.from(minHeap)).toEqual([]);
  });

  it("should heapify down through the right branch as well", () => {
    const minHeap = new MinHeap();

    minHeap.add(3);
    minHeap.add(12);
    minHeap.add(10);

    expect(Array.from(minHeap)).toEqual([3, 12, 10]);

    minHeap.add(11);
    expect(Array.from(minHeap)).toEqual([3, 11, 10, 12]);

    expect(minHeap.poll()).toBe(3);
    expect(Array.from(minHeap)).toEqual([10, 11, 12]);
  });

  it("should be possible to remove items from heap with heapify down", () => {
    const minHeap = new MinHeap();

    minHeap.add(3);
    minHeap.add(12);
    minHeap.add(10);
    minHeap.add(11);
    minHeap.add(11);

    expect(Array.from(minHeap)).toEqual([3, 11, 10, 12, 11]);

    expect(Array.from(minHeap.remove(3))).toEqual([10, 11, 11, 12]);
    expect(minHeap.remove(3).peek()).toEqual(10);
    expect(Array.from(minHeap.remove(11))).toEqual([10, 12]);
    expect(minHeap.remove(3).peek()).toEqual(10);
  });

  it("should be possible to remove items from heap with heapify up", () => {
    const minHeap = new MinHeap();

    minHeap.add(3);
    minHeap.add(10);
    minHeap.add(5);
    minHeap.add(6);
    minHeap.add(7);
    minHeap.add(4);
    minHeap.add(6);
    minHeap.add(8);
    minHeap.add(2);
    minHeap.add(1);

    expect(Array.from(minHeap)).toEqual([1, 2, 4, 6, 3, 5, 6, 10, 8, 7]);
    expect(Array.from(minHeap.remove(8))).toEqual([1, 2, 4, 6, 3, 5, 6, 10, 7]);
    expect(Array.from(minHeap.remove(7))).toEqual([1, 2, 4, 6, 3, 5, 6, 10]);
    expect(Array.from(minHeap.remove(1))).toEqual([2, 3, 4, 6, 10, 5, 6]);
    expect(Array.from(minHeap.remove(2))).toEqual([3, 6, 4, 6, 10, 5]);
    expect(Array.from(minHeap.remove(6))).toEqual([3, 5, 4, 10]);
    expect(Array.from(minHeap.remove(10))).toEqual([3, 5, 4]);
    expect(Array.from(minHeap.remove(5))).toEqual([3, 4]);
    expect(Array.from(minHeap.remove(3))).toEqual([4]);
    expect(Array.from(minHeap.remove(4))).toEqual([]);
  });

  it("should remove values from heap and correctly re-order the tree", () => {
    const minHeap = new MinHeap();

    minHeap.add(1);
    minHeap.add(2);
    minHeap.add(3);
    minHeap.add(4);
    minHeap.add(5);
    minHeap.add(6);
    minHeap.add(7);
    minHeap.add(8);
    minHeap.add(9);

    expect(Array.from(minHeap)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    minHeap.remove(2);
    expect(Array.from(minHeap)).toEqual([1, 4, 3, 8, 5, 6, 7, 9]);

    minHeap.remove(4);
    expect(Array.from(minHeap)).toEqual([1, 5, 3, 8, 9, 6, 7]);
  });
});
