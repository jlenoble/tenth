import {
  Comparator,
  ComparatorFunction,
  defaultCompare,
} from "../../comparator";
import { DataStructure, Constructor } from "../types";

export type HeapConstructor<T> = Constructor<Heap<T>>;

export abstract class Heap<T> implements DataStructure<T> {
  #heap: T[];
  #comparator: Comparator<T>;

  get size(): number {
    return this.#heap.length;
  }

  get comparator(): Comparator<T> {
    return this.#comparator;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.#heap;
  }

  constructor(
    values?: Iterable<T>,
    compare: ComparatorFunction<T> = defaultCompare
  ) {
    this.#heap = [];
    this.#comparator = new Comparator(compare);

    if (values) {
      for (const value of values) {
        this.add(value);
      }
    }
  }

  getLeftChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex: number): number {
    return Math.floor((childIndex - 1) / 2);
  }

  private swap(idx1: number, idx2: number): void {
    const tmp = this.#heap[idx2];
    this.#heap[idx2] = this.#heap[idx1];
    this.#heap[idx1] = tmp;
  }

  peek(): T | undefined {
    if (this.#heap.length === 0) {
      return;
    }
    return this.#heap[0];
  }

  poll(): T | undefined {
    if (this.#heap.length === 0) {
      return;
    }

    const lastItem = this.#heap.pop() as T;

    if (this.#heap.length === 0) {
      return lastItem;
    }

    const firstItem = this.#heap[0];
    this.#heap[0] = lastItem;
    this.heapifyDown(0);

    return firstItem;
  }

  add(item: T): this {
    this.#heap.push(item);
    this.heapifyUp(this.#heap.length - 1);
    return this;
  }

  remove(
    item: T,
    equal: (a: T, b: T) => boolean = this.#comparator.equal
  ): this {
    let nItems = 0;
    let l = this.#heap.length;

    for (let i = 0; i < l; i++) {
      if (equal(item, this.#heap[i])) {
        nItems++;
      }
    }

    for (let i = 0; i < nItems; i++) {
      let iRemove = 0;
      l = this.#heap.length;

      for (; iRemove < l; iRemove++) {
        if (equal(item, this.#heap[iRemove])) {
          break;
        }
      }

      const lastItem = this.#heap.pop();

      if (iRemove === l - 1 || !lastItem) {
        continue;
      } else {
        this.#heap[iRemove] = lastItem;

        if (this.getLeftChildIndex(iRemove) >= l) {
          this.heapifyUp(iRemove);
          continue;
        }

        const parentIndex = this.getParentIndex(iRemove);

        if (
          parentIndex < 0 ||
          this.pairIsInCorrectOrder(
            this.#heap[parentIndex],
            this.#heap[iRemove]
          )
        ) {
          this.heapifyDown(iRemove);
        } else {
          this.heapifyUp(iRemove);
        }
      }
    }

    return this;
  }

  private heapifyUp(currentIndex: number): void {
    let parentIndex = this.getParentIndex(currentIndex);

    while (
      parentIndex >= 0 &&
      !this.pairIsInCorrectOrder(
        this.#heap[parentIndex],
        this.#heap[currentIndex]
      )
    ) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  private heapifyDown(currentIndex: number): void {
    let nextIndex = null;
    let leftIndex = this.getLeftChildIndex(currentIndex);
    let rightIndex = this.getRightChildIndex(currentIndex);
    const l = this.#heap.length;

    while (leftIndex < l) {
      if (
        rightIndex < l &&
        this.pairIsInCorrectOrder(this.#heap[rightIndex], this.#heap[leftIndex])
      ) {
        nextIndex = rightIndex;
      } else {
        nextIndex = leftIndex;
      }

      if (
        this.pairIsInCorrectOrder(
          this.#heap[currentIndex],
          this.#heap[nextIndex]
        )
      ) {
        break;
      }

      this.swap(currentIndex, nextIndex);

      currentIndex = nextIndex;
      leftIndex = this.getLeftChildIndex(currentIndex);
      rightIndex = this.getRightChildIndex(currentIndex);
    }
  }

  abstract pairIsInCorrectOrder(a: T, b: T): boolean;

  isEmpty(): boolean {
    return this.#heap.length === 0;
  }
}
