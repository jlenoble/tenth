import { MinHeap } from "../heap";
import { Constructor } from "../types";

export type PriorityQueueConstructor<T> = Constructor<PriorityQueue<T>>;

export class PriorityQueue<T> extends MinHeap<T> {
  #priorities: Map<T, number>;
  #equal: (a: T, b: T) => boolean;
  #comparePriorities: (a: T, b: T) => -1 | 0 | 1;

  constructor(
    init?: Iterable<[T, number]>,
    equal: (a: T, b: T) => boolean = (a: T, b: T) => a === b
  ) {
    super();

    this.#priorities = init ? new Map<T, number>(init) : new Map<T, number>();
    this.#equal = equal;

    this.#comparePriorities = (a: T, b: T): -1 | 0 | 1 => {
      const pA = this.#priorities.get(a)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      const pB = this.#priorities.get(b)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

      return pA === pB ? 0 : pA > pB ? 1 : -1;
    };

    this.comparator.resetCompare(this.#comparePriorities);

    for (const value of this.#priorities.keys()) {
      super.add(value);
    }
  }

  add(value: T, priority = 0): this {
    this.#priorities.set(value, priority);
    return super.add(value);
  }

  remove(value: T, equal: (a: T, b: T) => boolean = this.#equal): this {
    super.remove(value, equal);
    this.#priorities.delete(value);
    return this;
  }
}
