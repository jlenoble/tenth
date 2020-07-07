import { Node, Constructor, DataStructure } from "../types";
import { Comparator } from "../../comparator";

export type BinaryTreeNodeConstructor<T> = Constructor<BinaryTreeNode<T>>;

export interface BinaryTreeNode<T> extends Node<T> {
  comparator: Comparator<T>;
  left: BinaryTreeNode<T> | null;
  right: BinaryTreeNode<T> | null;
  parent: BinaryTreeNode<T> | null;
  root: BinaryTreeNode<T>;

  [Symbol.iterator](): IterableIterator<T>;
  dftNodeIterate(): IterableIterator<BinaryTreeNode<T>>;
  bftNodeIterate(): IterableIterator<BinaryTreeNode<T>>;

  removeChild(node: BinaryTreeNode<T>): boolean;
  replaceChild(
    node: BinaryTreeNode<T>,
    replacementNode: BinaryTreeNode<T>
  ): boolean;
}

export type BinaryTreeConstructor<T> = Constructor<BinaryTree<T>>;

export interface BinaryTree<T> extends DataStructure<T> {
  comparator: Comparator<T>;

  [Symbol.iterator](): IterableIterator<T>;
}
