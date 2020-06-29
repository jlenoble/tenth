import { LinkedListNode as LinkedListNodeInterface } from "./types";

export class LinkedListNode<T> implements LinkedListNodeInterface<T> {
  readonly value: T;
  next: LinkedListNode<T> | null;

  constructor(value: T, next: LinkedListNode<T> | null = null) {
    this.value = value;
    this.next = next;
  }
}
