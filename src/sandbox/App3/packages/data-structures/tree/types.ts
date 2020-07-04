import { Node, Constructor } from "../types";
import { Comparator } from "../../comparator";

export interface BinaryTreeNode<T> extends Node<T> {
  comparator: Comparator<T>;
  left: BinaryTreeNode<T> | null;
  right: BinaryTreeNode<T> | null;
  parent: BinaryTreeNode<T> | null;
  root: BinaryTreeNode<T>;
}

export type BinaryTreeConstructor<T> = Constructor<BinaryTree<T>>;

export interface BinaryTree<T> {
  root: BinaryTreeNode<T> | null;
  comparator: Comparator<T>;
}
