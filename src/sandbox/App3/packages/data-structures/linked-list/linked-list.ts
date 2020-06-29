import { LinkedList as LinkedListInterface } from "./types";
import { LinkedListNode } from "./linked-list-node";

export class LinkedList<T> implements LinkedListInterface<T> {
  size: number;
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;

  *[Symbol.iterator](): IterableIterator<T> {
    let node = this.head;

    while (node !== null) {
      yield node.value;
      node = node.next;
    }
  }

  constructor() {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }

  append(value: T): this {
    const node = new LinkedListNode(value);

    if (this.tail === null) {
      this.head = node;
      this.tail = node;
      this.size = 1;

      return this;
    }

    this.tail.next = node;
    this.tail = node;
    this.size++;

    return this;
  }

  prepend(value: T): this {
    const node = new LinkedListNode(value, this.head);

    if (this.head === null) {
      this.head = node;
      this.tail = node;
      this.size = 1;

      return this;
    }

    this.head = node;
    this.size++;

    return this;
  }

  deleteHead(): LinkedListNode<T> | null {
    if (this.head === null) {
      return null;
    }

    const head = this.head;
    this.head = head.next;
    this.size--;

    return head;
  }

  deleteTail(): LinkedListNode<T> | null {
    if (this.head === null) {
      return null;
    }

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      this.size = 0;
      return null;
    }

    const tail = this.tail;
    let pretail: LinkedListNode<T> = this.head;

    while (pretail.next !== null) {
      if (pretail.next === tail) {
        break;
      }
      pretail = pretail.next;
    }

    this.tail = pretail;
    pretail.next = null;
    this.size--;

    return tail;
  }
}
