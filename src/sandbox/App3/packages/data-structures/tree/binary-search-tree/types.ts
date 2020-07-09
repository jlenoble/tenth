import { Constructor } from "../../types";
import { BinaryTreeNode, BinaryTree } from "../types";
import { Comparator } from "../../../comparator";

export type BinarySearchTreeNodeConstructor<T> = Constructor<
  BinarySearchTreeNode<T>
>;

export interface BinarySearchTreeNode<T> extends BinaryTreeNode<T> {
  comparator: Comparator<T>;

  insert(value: T): boolean;
  remove(value: T): boolean;
  has(value: T): boolean;

  _insert(value: T): BinarySearchTreeNode<T> | null;
  _remove(value: T): BinarySearchTreeNode<T> | null;
  _find(value: T): BinarySearchTreeNode<T> | null;
  _findMin(): BinarySearchTreeNode<T>;
}

export type BinarySearchTreeConstructor<T> = Constructor<BinarySearchTree<T>>;

export interface BinarySearchTree<T> extends BinaryTree<T> {
  comparator: Comparator<T>;

  insert(value: T): boolean;
  remove(value: T): boolean;
  has(value: T): boolean;

  _insert(value: T): BinarySearchTreeNode<T> | null;
  _remove(value: T): BinarySearchTreeNode<T> | null;

  dftNodeIterate(): IterableIterator<BinarySearchTreeNode<T>>;
  bftNodeIterate(): IterableIterator<BinarySearchTreeNode<T>>;

  toString<N extends BinarySearchTreeNode<T>, V>(fn?: (node: N) => V): string;
}
