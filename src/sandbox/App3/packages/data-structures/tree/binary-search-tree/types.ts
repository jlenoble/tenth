import { Constructor } from "../../types";
import { BinaryTreeNode, BinaryTree } from "../types";

export type BinarySearchTreeNodeConstructor<T> = Constructor<
  BinarySearchTreeNode<T>
>;

export interface BinarySearchTreeNode<T> extends BinaryTreeNode<T> {
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
  insert(value: T): boolean;
  remove(value: T): boolean;
  has(value: T): boolean;

  _insert(value: T): BinarySearchTreeNode<T> | null;
  _remove(value: T): BinarySearchTreeNode<T> | null;

  dftNodeIterate(): IterableIterator<BinarySearchTreeNode<T>>;
}
