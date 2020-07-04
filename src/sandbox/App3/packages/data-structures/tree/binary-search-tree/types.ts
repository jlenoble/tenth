import { Constructor } from "../../types";
import { BinaryTreeNode, BinaryTree } from "../types";

export interface RootBinarySearchTreeNode<T> {
  insert(value: T): boolean;
}

export interface BinarySearchTreeNode<T>
  extends BinaryTreeNode<T>,
    RootBinarySearchTreeNode<T> {
  left: BinarySearchTreeNode<T> | null;
  right: BinarySearchTreeNode<T> | null;
  parent: BinarySearchTreeNode<T> | null;
}

export type BinarySearchTreeConstructor<
  T,
  N extends BinarySearchTreeNode<T>
> = Constructor<BinarySearchTree<T, N>>;

export interface BinarySearchTree<T, N extends BinarySearchTreeNode<T>>
  extends BinaryTree<T, N> {
  insert(value: T): boolean;
}
