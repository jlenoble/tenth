import { Heap } from "./heap";

export class MaxHeap<T> extends Heap<T> {
  pairIsInCorrectOrder(a: T, b: T): boolean {
    return this.comparator.greaterThanOrEqual(a, b);
  }
}
