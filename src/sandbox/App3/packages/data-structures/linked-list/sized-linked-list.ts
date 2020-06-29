import { LinkedListNode } from "./linked-list-node";
import { LinkedList } from "./linked-list";

export class SizedLinkedList<T> extends LinkedList<T> {
  #size: number;

  get size(): number {
    return this.#size;
  }

  constructor() {
    super();
    this.#size = 0;
  }

  append(value: T): this {
    this.#size++;
    return super.append(value);
  }

  prepend(value: T): this {
    this.#size++;
    return super.prepend(value);
  }

  deleteHead(): LinkedListNode<T> | null {
    if (this.size === 0) {
      return null;
    }
    this.#size--;
    return super.deleteHead();
  }

  deleteTail(): LinkedListNode<T> | null {
    if (this.size === 0) {
      return null;
    }
    this.#size--;
    return super.deleteTail();
  }
}
