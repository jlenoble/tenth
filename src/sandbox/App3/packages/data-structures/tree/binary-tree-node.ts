import { Comparator } from "../../comparator";
import { BinaryTreeNode as BinaryTreeNodeInterface } from "./types";

export class BinaryTreeNode<T> implements BinaryTreeNodeInterface<T> {
  #left: BinaryTreeNode<T> | null;
  #right: BinaryTreeNode<T> | null;
  #parent: BinaryTreeNode<T> | null;
  #value: T;
  #comparator: Comparator<T>;

  get left(): BinaryTreeNode<T> | null {
    return this.#left;
  }
  set left(node: BinaryTreeNode<T> | null) {
    if (this.#left !== null) {
      this.#left.#parent = null;
    }

    this.#left = node;

    if (this.#left !== null) {
      this.#left.#parent = this;
    }
  }

  get right(): BinaryTreeNode<T> | null {
    return this.#right;
  }
  set right(node: BinaryTreeNode<T> | null) {
    if (this.#right !== null) {
      this.#right.#parent = null;
    }

    this.#right = node;

    if (this.#right !== null) {
      this.#right.#parent = this;
    }
  }

  get parent(): BinaryTreeNode<T> | null {
    return this.#parent;
  }
  set parent(node: BinaryTreeNode<T> | null) {
    this.#parent = node;
  }

  get root(): BinaryTreeNode<T> {
    return this.#parent === null ? this : this.#parent.root;
  }

  get value(): T {
    return this.#value;
  }
  set value(value: T) {
    this.#value = value;
  }

  get comparator(): Comparator<T> {
    return this.#comparator;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    if (this.#left !== null) {
      yield* this.#left;
    }

    yield this.#value;

    if (this.#right !== null) {
      yield* this.#right;
    }
  }

  *dftNodeIterate(): IterableIterator<BinaryTreeNode<T>> {
    if (this.#left !== null) {
      yield* this.#left.dftNodeIterate();
    }

    yield this;

    if (this.#right !== null) {
      yield* this.#right.dftNodeIterate();
    }
  }

  constructor(value: T, comparator: Comparator<T>) {
    this.#value = value;
    this.#comparator = comparator;

    this.#parent = null;
    this.#left = null;
    this.#right = null;
  }

  removeChild(node: BinaryTreeNode<T>): boolean {
    if (this.#left === node) {
      this.left = null;
      return true;
    }

    if (this.#right === node) {
      this.right = null;
      return true;
    }

    return false;
  }

  replaceChild(
    node: BinaryTreeNode<T>,
    replacementNode: BinaryTreeNode<T>
  ): boolean {
    if (node === null || replacementNode === null) {
      return false;
    }

    if (this.#left === node) {
      this.left = replacementNode;
      return true;
    }

    if (this.#right === node) {
      this.right = replacementNode;
      return true;
    }

    return false;
  }
}
