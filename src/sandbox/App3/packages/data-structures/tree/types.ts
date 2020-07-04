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

export type BinaryTreeConstructor<T, N extends BinaryTreeNode<T>> = Constructor<
  BinaryTree<T, N>
>;

export interface BinaryTree<T, N extends BinaryTreeNode<T>> {
  root: N | null;
  comparator: Comparator<T>;

  [Symbol.iterator](): IterableIterator<T>;
}
