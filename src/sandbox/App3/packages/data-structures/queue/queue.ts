import { DataStructure, Constructor } from "../types";

export type QueueConstructor<T> = Constructor<Queue<T>>;

export class Queue<T> implements DataStructure<T> {
  #elements: T[] = [];

  get size(): number {
    return this.#elements.length;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.#elements[Symbol.iterator]();
  }

  constructor(values?: Iterable<T>) {
    this.#elements = [];

    if (values) {
      this.#elements = Array.from(values);
    } else {
      this.#elements = [];
    }
  }

  isEmpty(): boolean {
    return this.#elements.length === 0;
  }

  peek(): T | undefined {
    return this.#elements[0];
  }

  enqueue(...values: T[]): number {
    return this.#elements.push(...values);
  }

  dequeue(): T | undefined {
    return this.#elements.shift();
  }
}
