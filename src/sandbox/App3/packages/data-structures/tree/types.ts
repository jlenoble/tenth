import { Node, Constructor } from "../types";
import { Comparator } from "../../comparator";

export interface BinaryTreeNode<T> extends Node<T> {
  comparator: Comparator<T>;
  left: BinaryTreeNode<T> | null;
  right: BinaryTreeNode<T> | null;
  parent: BinaryTreeNode<T> | null;
  root: BinaryTreeNode<T>;

  [Symbol.iterator](): IterableIterator<T>;
}

export type BinaryTreeConstructor<T> = Constructor<BinaryTree<T>>;

export interface BinaryTree<T> {
  comparator: Comparator<T>;

  [Symbol.iterator](): IterableIterator<T>;
}