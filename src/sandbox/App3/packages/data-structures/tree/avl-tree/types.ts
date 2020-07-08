import { Constructor } from "../../types";
import {
  BinarySearchTreeNode,
  BinarySearchTree,
} from "../binary-search-tree/types";

export type AvlTreeNodeConstructor<T> = Constructor<AvlTreeNode<T>>;

export interface AvlTreeNode<T> extends BinarySearchTreeNode<T> {
  height: number;
}

export type AvlTreeConstructor<T> = Constructor<AvlTree<T>>;

export interface AvlTree<T> extends BinarySearchTree<T> {
  height: number;
}
