import { LinkedList as LinkedListInterface } from "./types";
import { LinkedListNode } from "./linked-list-node";

export class LinkedList<T>
  implements LinkedListInterface<T, LinkedListNode<T>> {
  #head: LinkedListNode<T> | null;

  get head(): T | undefined {
    if (this.#head === null) {
      return;
    }
    return this.#head.value;
  }

  get tail(): T | undefined {
    // Inefficient. If called often, use LinkedList instead
    if (this.#head === null) {
      return;
    }

    let tail = this.#head;

    while (tail.next !== null) {
      tail = tail.next;
    }

    return tail.value;
  }

  get size(): number {
    // Inefficient. If called often, use SizedLinkedList instead
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

  constructor(values?: Iterable<T>) {
    this.#head = null;

    if (values) {
      for (const value of values) {
        this.append(value);
      }
    }
  }

  append(value: T): this {
    // Inefficient. If called often, use LinkedList instead
    const node = new LinkedListNode(value);

    if (this.#head === null) {
      this.#head = node;
      return this;
    }

    let tail: LinkedListNode<T> = this.#head;

    while (tail.next !== null) {
      tail = tail.next;
    }

    tail.next = node;

    return this;
  }

  prepend(value: T): this {
    const node = new LinkedListNode(value, this.#head);

    this.#head = node;

    return this;
  }

  deleteHead(): LinkedListNode<T> | null {
    if (this.#head === null) {
      return null;
    }

    const head = this.#head;
    this.#head = head.next;

    return head;
  }

  deleteTail(): LinkedListNode<T> | null {
    // Inefficient. If called often, use LinkedList instead
    if (this.#head === null) {
      return null;
    }

    let pretail: LinkedListNode<T> = this.#head;
    let tail: LinkedListNode<T> | null = pretail.next;

    if (pretail.next === null) {
      this.#head = null;
      return pretail;
    }

    while (tail !== null && tail.next !== null) {
      pretail = tail;
      tail = tail.next;
    }

    pretail.next = null;

    return tail;
  }

  isEmpty(): boolean {
    return this.#head === null;
  }
}
