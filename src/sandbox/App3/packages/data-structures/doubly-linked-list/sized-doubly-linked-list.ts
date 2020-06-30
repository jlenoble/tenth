import { DoublyLinkedListNode } from "./doubly-linked-list-node";
import { DoublyLinkedList } from "./doubly-linked-list";

export class SizedDoublyLinkedList<T> extends DoublyLinkedList<T> {
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

  deleteHead(): DoublyLinkedListNode<T> | null {
    if (this.size === 0) {
      return null;
    }
    this.#size--;
    return super.deleteHead();
  }

  deleteTail(): DoublyLinkedListNode<T> | null {
    if (this.size === 0) {
      return null;
    }
    this.#size--;
    return super.deleteTail();
  }
}
