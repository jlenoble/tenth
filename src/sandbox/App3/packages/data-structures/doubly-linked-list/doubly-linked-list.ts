import { DoublyLinkedList as DoublyLinkedListInterface } from "./types";
import { DoublyLinkedListNode } from "./doubly-linked-list-node";

export class DoublyLinkedList<T> implements DoublyLinkedListInterface<T> {
  #head: DoublyLinkedListNode<T> | null;
  #tail: DoublyLinkedListNode<T> | null;

  get head(): T | undefined {
    if (this.#head === null) {
      return;
    }
    return this.#head.value;
  }

  get tail(): T | undefined {
    if (this.#tail === null) {
      return;
    }
    return this.#tail.value;
  }

  get size(): number {
    // Inefficient. If called often, use SizedDoublyLinkedList instead
    let n = 0;
    let node = this.#head;

    while (node !== null) {
      node = node.next;
      n++;
    }

    return n++;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    let node = this.#head;

    while (node !== null) {
      yield node.value;
      node = node.next;
    }
  }

  constructor(values?: IterableIterator<T>) {
    this.#head = null;
    this.#tail = null;

    if (values) {
      for (const value of values) {
        this.append(value);
      }
    }
  }

  append(value: T): this {
    const node = new DoublyLinkedListNode(value, this.#tail);

    if (this.#tail === null) {
      this.#head = node;
      this.#tail = node;
      return this;
    }

    this.#tail.next = node;
    this.#tail = node;

    return this;
  }

  prepend(value: T): this {
    const node = new DoublyLinkedListNode(value, null, this.#head);

    if (this.#head === null) {
      this.#head = node;
      this.#tail = node;
      return this;
    }

    this.#head.previous = node;
    this.#head = node;

    return this;
  }

  deleteHead(): DoublyLinkedListNode<T> | null {
    if (this.#head === null) {
      return null;
    }

    const head = this.#head;

    if (this.#tail === head) {
      this.#head = null;
      this.#tail = null;
      return head;
    }

    const next = head.next;

    if (next !== null) {
      next.previous = null;
    }

    this.#head = next;

    return head;
  }

  deleteTail(): DoublyLinkedListNode<T> | null {
    if (this.#tail === null) {
      return null;
    }

    const tail = this.#tail;

    if (this.#head === tail) {
      this.#head = null;
      this.#tail = null;
      return tail;
    }

    const previous = tail.previous;

    if (previous !== null) {
      previous.next = null;
    }

    this.#tail = previous;

    return tail;
  }

  isEmpty(): boolean {
    return this.#head === null;
  }
}
