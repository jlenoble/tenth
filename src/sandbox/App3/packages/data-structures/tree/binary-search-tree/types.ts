import { Constructor } from "../../types";
import { BinaryTreeNode, BinaryTree } from "../types";

export interface RootBinarySearchTreeNode<T> {
  insert(value: T): boolean;
  remove(value: T): boolean;
  has(value: T): boolean;
  equalValue(value: T): boolean;
}

export interface BinarySearchTreeNode<T>
  extends BinaryTreeNode<T>,
    RootBinarySearchTreeNode<T> {
  left: BinarySearchTreeNode<T> | null;
  right: BinarySearchTreeNode<T> | null;
  parent: BinarySearchTreeNode<T> | null;
}

export type BinarySearchTreeConstructor<T> = Constructor<BinarySearchTree<T>>;

export interface BinarySearchTree<T> extends BinaryTree<T> {
  insert(value: T): boolean;
  has(value: T): boolean;
}
