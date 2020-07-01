import { Node, DataStructure } from "../types";

export class Queue<T> implements DataStructure<T, Node<T>> {
  #elements: T[] = [];

  get size(): number {
    return this.#elements.length;
  }

  get head(): T | undefined {
    return this.#elements[0];
  }

  get tail(): T | undefined {
    return this.#elements[this.#elements.length - 1];
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.#elements[Symbol.iterator]();
  }

  append(value: T): this {
    this.#elements.push(value);
    return this;
  }

  prepend(value: T): this {
    this.#elements.unshift(value);
    return this;
  }

  deleteHead(): Node<T> | null {
    if (this.#elements.length > 0) {
      const value = this.#elements.shift() as T;
      return { value };
    }
    return null;
  }

  deleteTail(): Node<T> | null {
    if (this.#elements.length > 0) {
      const value = this.#elements.pop() as T;
      return { value };
    }
    return null;
  }

  isEmpty(): boolean {
    return this.#elements.length === 0;
  }

  peek(): T | undefined {
    return this.#elements[0];
  }

  push(...values: T[]): number {
    for (let i = 0; i < values.length; i++) {
      this.#elements.unshift(values[i]);
    }
    return this.#elements.length;
  }

  pop(): T | undefined {
    return this.#elements.shift();
  }

  enqueue(...values: T[]): number {
    return this.#elements.push(...values);
  }

  dequeue(): T | undefined {
    return this.#elements.shift();
  }
}