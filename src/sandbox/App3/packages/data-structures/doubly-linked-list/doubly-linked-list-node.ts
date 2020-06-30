import { DoublyLinkedListNode as DoublyLinkedListNodeInterface } from "./types";

export class DoublyLinkedListNode<T>
  implements DoublyLinkedListNodeInterface<T> {
  readonly value: T;
  previous: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;

  constructor(
    value: T,
    previous: DoublyLinkedListNode<T> | null = null,
    next: DoublyLinkedListNode<T> | null = null
  ) {
    this.value = value;
    this.previous = previous;
    this.next = next;
  }
}
