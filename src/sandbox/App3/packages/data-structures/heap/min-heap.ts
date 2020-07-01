import { Heap } from "./heap";

export class MinHeap<T> extends Heap<T> {
  pairIsInCorrectOrder(a: T, b: T): boolean {
    return this.comparator.lessThanOrEqual(a, b);
  }
}
