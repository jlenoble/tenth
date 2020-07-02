import { DataStructure, Constructor } from "../types";

export type StackConstructor<T> = Constructor<Stack<T>>;

export class Stack<T> implements DataStructure<T> {
  #elements: T[];

  get size(): number {
    return this.#elements.length;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = this.#elements.length - 1; i >= 0; i--) {
      yield this.#elements[i];
    }
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
    return this.#elements[this.#elements.length - 1];
  }

  push(...values: T[]): number {
    return this.#elements.push(...values);
  }

  pop(): T | undefined {
    return this.#elements.pop();
  }
}
