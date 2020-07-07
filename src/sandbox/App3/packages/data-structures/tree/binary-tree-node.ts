import { BinaryTreeNode as BinaryTreeNodeInterface } from "./types";

export class BinaryTreeNode<T> implements BinaryTreeNodeInterface<T> {
  #left: BinaryTreeNode<T> | null;
  #right: BinaryTreeNode<T> | null;
  #parent: BinaryTreeNode<T> | null;
  #value: T;

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

  *dftNodeIterateWithDepth(
    depth = 0
  ): IterableIterator<{ node: BinaryTreeNode<T>; depth: number }> {
    if (this.#left !== null) {
      yield* this.#left.dftNodeIterateWithDepth(depth + 1);
    }

    yield { node: this, depth };

    if (this.#right !== null) {
      yield* this.#right.dftNodeIterateWithDepth(depth + 1);
    }
  }

  *bftNodeIterate(): IterableIterator<BinaryTreeNode<T>> {
    const queue: BinaryTreeNode<T>[] = [this];

    while (queue.length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const node = queue.shift()!;

      yield node;

      if (node.#left !== null) {
        queue.push(node.#left);
      }

      if (node.#right !== null) {
        queue.push(node.#right);
      }
    }
  }

  *bftNodeIterateWithDepth(
    depth = 0
  ): IterableIterator<{ node: BinaryTreeNode<T>; depth: number }> {
    const queue: { node: BinaryTreeNode<T>; depth: number }[] = [
      { node: this, depth },
    ];

    while (queue.length !== 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const res = queue.shift()!;
      const { node, depth } = res;

      yield res;

      if (node.#left !== null) {
        queue.push({ node: node.#left, depth: depth + 1 });
      }

      if (node.#right !== null) {
        queue.push({ node: node.#right, depth: depth + 1 });
      }
    }
  }

  constructor(value: T) {
    this.#value = value;
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
