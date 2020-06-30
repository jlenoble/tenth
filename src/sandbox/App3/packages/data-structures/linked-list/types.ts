import { Node, Constructor, DataStructure } from "../types";

export interface LinkedListNode<T> extends Node<T> {
  next: LinkedListNode<T> | null;
}

export type LinkedListConstructor<T> = Constructor<LinkedList<T>>;

export type LinkedList<T> = DataStructure<T, LinkedListNode<T>>;
