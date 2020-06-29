import { LinkedList as LinkedListInterface } from "../types";
import { LinkedListNode } from "./linked-list-node";

export class LinkedList<T> implements LinkedListInterface<T> {
  size: number;
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;

  constructor() {
    this.size = 0;
    this.head = null;
    this.tail = null;
  }

  append(value: T): this {
    const node = new LinkedListNode(value);

    if (!this.tail) {
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

    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.size = 1;

      return this;
    }

    this.head = node;
    this.size++;

    return this;
  }
}
