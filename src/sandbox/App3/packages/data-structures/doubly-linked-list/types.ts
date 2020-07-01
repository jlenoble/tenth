import { Node, Constructor, DataStructure } from "../types";

export interface DoublyLinkedListNode<T> extends Node<T> {
  previous: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;
}

export type DoublyLinkedListConstructor<T> = Constructor<DoublyLinkedList<T>>;

export interface DoublyLinkedList<T> extends DataStructure<T> {
  head: T | undefined;
  tail: T | undefined;

  append(value: T): this;
  prepend(value: T): this;
  deleteHead(): DoublyLinkedListNode<T> | null;
  deleteTail(): DoublyLinkedListNode<T> | null;
}
