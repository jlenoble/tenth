import { LinkedList as LinkedListInterface } from "./types";
import { LinkedListNode } from "./linked-list-node";

export class LinkedList<T> implements LinkedListInterface<T> {
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

  constructor() {
    this.#head = null;
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

  peek(): T | undefined {
    return this.head;
  }

  push(...values: T[]): number {
    // Inefficient. If called often, use SizedLinkedList
    for (const value of values) {
      this.prepend(value);
    }
    return this.size;
  }

  pop(): T | undefined {
    // Inefficient. If called often, use SizedLinkedList
    const head = this.deleteHead();
    if (head) {
      return head.value;
    }
  }

  enqueue(...values: T[]): number {
    // Inefficient. If called often, use SizedDoublyLinkedList or Queue
    for (const value of values) {
      this.append(value);
    }
    return this.size;
  }

  dequeue(): T | undefined {
    // Inefficient. If called often, use SizedLinkedList or Queue
    const head = this.deleteHead();
    if (head) {
      return head.value;
    }
  }
}