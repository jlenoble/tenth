import { Node, Constructor, DataStructure } from "../types";

export interface LinkedListNode<T> extends Node<T> {
  next: LinkedListNode<T> | null;
}

export type LinkedListConstructor<T, N extends LinkedListNode<T>> = Constructor<
  LinkedList<T, N>
>;

export interface LinkedList<T, N extends LinkedListNode<T>>
  extends DataStructure<T> {
  head: T | undefined;
  tail: T | undefined;

  append(value: T): this;
  prepend(value: T): this;
  deleteHead(): N | null;
  deleteTail(): N | null;
}
