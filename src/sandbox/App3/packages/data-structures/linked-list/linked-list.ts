import { LinkedList as LinkedListInterface } from "./types";
import { LinkedListNode } from "./linked-list-node";

export class LinkedList<T> implements LinkedListInterface<T> {
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;

  get size(): number {
    // Inefficient. If called often, use SizedLinkedList instead
    let n = 0;
    let node = this.head;

    while (node !== null) {
      node = node.next;
      n++;
    }

    return n++;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    let node = this.head;

    while (node !== null) {
      yield node.value;
      node = node.next;
    }
  }

  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(value: T): this {
    const node = new LinkedListNode(value);

    if (this.tail === null) {
      this.head = node;
      this.tail = node;

      return this;
    }

    this.tail.next = node;
    this.tail = node;

    return this;
  }

  prepend(value: T): this {
    const node = new LinkedListNode(value, this.head);

    if (this.head === null) {
      this.head = node;
      this.tail = node;

      return this;
    }

    this.head = node;

    return this;
  }

  deleteHead(): LinkedListNode<T> | null {
    if (this.head === null) {
      return null;
    }

    const head = this.head;
    this.head = head.next;

    return head;
  }

  deleteTail(): LinkedListNode<T> | null {
    if (this.head === null) {
      return null;
    }

    const tail = this.tail;

    if (this.head === tail) {
      this.head = null;
      this.tail = null;
      return tail;
    }

    let pretail: LinkedListNode<T> = this.head;

    while (pretail.next !== null) {
      if (pretail.next === tail) {
        break;
      }
      pretail = pretail.next;
    }

    this.tail = pretail;
    pretail.next = null;

    return tail;
  }
}
