import { Node, Constructor, DataStructure } from "../types";

export type BinaryTreeNodeConstructor<T> = Constructor<BinaryTreeNode<T>>;

export interface BinaryTreeNode<T> extends Node<T> {
  left: BinaryTreeNode<T> | null;
  right: BinaryTreeNode<T> | null;
  parent: BinaryTreeNode<T> | null;
  root: BinaryTreeNode<T>;

  [Symbol.iterator](): IterableIterator<T>;
  dftNodeIterate(): IterableIterator<BinaryTreeNode<T>>;
  bftNodeIterate(): IterableIterator<BinaryTreeNode<T>>;
  dftNodeIterateWithDepth(
    depth?: number
  ): IterableIterator<{ node: BinaryTreeNode<T>; depth: number }>;
  bftNodeIterateWithDepth(
    depth?: number
  ): IterableIterator<{ node: BinaryTreeNode<T>; depth: number }>;

  removeChild(node: BinaryTreeNode<T>): boolean;
  replaceChild(
    node: BinaryTreeNode<T>,
    replacementNode: BinaryTreeNode<T>
  ): boolean;

  toString<N extends BinaryTreeNode<T>, V>(fn?: (node: N) => V): string;
}

export type BinaryTreeConstructor<T> = Constructor<BinaryTree<T>>;

export interface BinaryTree<T> extends DataStructure<T> {
  [Symbol.iterator](): IterableIterator<T>;
}
