import { Node, Constructor, DataStructure } from "../types";

export interface DoublyLinkedListNode<T> extends Node<T> {
  previous: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;
}

export type DoublyLinkedListConstructor<T> = Constructor<DoublyLinkedList<T>>;

export type DoublyLinkedList<T> = DataStructure<T, DoublyLinkedListNode<T>>;
