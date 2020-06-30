import { Node, DataStructure } from "../types";

export class Stack<T> extends Array<T> implements DataStructure<T, Node<T>> {
  get size(): number {
    return this.length;
  }

  get head(): T | undefined {
    return this[0];
  }

  get tail(): T | undefined {
    return this[this.length - 1];
  }

  append(value: T): this {
    this.push(value);
    return this;
  }

  prepend(value: T): this {
    this.unshift(value);
    return this;
  }

  deleteHead(): Node<T> | null {
    if (this.length > 0) {
      const value = this.shift() as T;
      return { value };
    }
    return null;
  }

  deleteTail(): Node<T> | null {
    if (this.length > 0) {
      const value = this.pop() as T;
      return { value };
    }
    return null;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  peek(): T | undefined {
    return this[this.length - 1];
  }
}
