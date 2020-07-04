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

  get root(): BinaryTreeNode<T> {
    return this.#parent === null ? this : this.#parent.root;
  }

  get value(): T {
    return this.#value;
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

  constructor(value: T, comparator: Comparator<T>) {
    this.#value = value;
    this.#comparator = comparator;

    this.#parent = null;
    this.#left = null;
    this.#right = null;
  }
}
