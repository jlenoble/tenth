import { Node, DataStructure } from "../types";

export class Stack<T> implements DataStructure<T, Node<T>> {
  #elements: T[] = [];

  get size(): number {
    return this.#elements.length;
  }

  get head(): T | undefined {
    return this.#elements[this.#elements.length - 1];
  }

  get tail(): T | undefined {
    return this.#elements[0];
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let i = this.#elements.length - 1; i >= 0; i--) {
      yield this.#elements[i];
    }
  }

  append(value: T): this {
    this.#elements.unshift(value);
    return this;
  }

  prepend(value: T): this {
    this.#elements.push(value);
    return this;
  }

  deleteHead(): Node<T> | null {
    if (this.#elements.length > 0) {
      const value = this.#elements.pop() as T;
      return { value };
    }
    return null;
  }

  deleteTail(): Node<T> | null {
    if (this.#elements.length > 0) {
      const value = this.#elements.shift() as T;
      return { value };
    }
    return null;
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
