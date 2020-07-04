import { Comparator } from "../../../comparator";
import { BinaryTreeNode } from "../binary-tree-node";
import {
  RootBinarySearchTreeNode as RootBinarySearchTreeNodeInterface,
  BinarySearchTreeNode as BinarySearchTreeNodeInterface,
  BinarySearchTree as BinarySearchTreeInterface,
} from "./types";

class RootBinarySearchTreeNode<T>
  implements RootBinarySearchTreeNodeInterface<T> {
  #initializeTree: (value: T) => void;

  constructor(initializeTree: (value: T) => void) {
    this.#initializeTree = initializeTree;
  }

  insert(value: T): boolean {
    this.#initializeTree(value);
    return true;
  }

  has(): boolean {
    return false;
  }
}

class BinarySearchTreeNode<T> extends BinaryTreeNode<T>
  implements BinarySearchTreeNodeInterface<T> {
  get left(): BinarySearchTreeNode<T> | null {
    return super.left as BinarySearchTreeNode<T> | null;
  }
  set left(node: BinarySearchTreeNode<T> | null) {
    super.left = node;
  }

  get right(): BinarySearchTreeNode<T> | null {
    return super.right as BinarySearchTreeNode<T> | null;
  }
  set right(node: BinarySearchTreeNode<T> | null) {
    super.right = node;
  }

  get parent(): BinarySearchTreeNode<T> | null {
    return super.parent as BinarySearchTreeNode<T> | null;
  }

  insert(value: T): boolean {
    if (this.comparator.lessThan(value, this.value)) {
      if (this.left !== null) {
        return this.left.insert(value);
      }

      this.left = new BinarySearchTreeNode(value, this.comparator);
    } else if (this.comparator.greaterThan(value, this.value)) {
      if (this.right !== null) {
        return this.right.insert(value);
      }

      this.right = new BinarySearchTreeNode(value, this.comparator);
    }

    return false;
  }

  has(value: T): boolean {
    if (this.comparator.equal(this.value, value)) {
      return true;
    }

    if (this.comparator.lessThan(value, this.value) && this.left !== null) {
      return this.left.has(value);
    }

    if (this.comparator.greaterThan(value, this.value) && this.right !== null) {
      return this.right.has(value);
    }

    return false;
  }
}

export class BinarySearchTree<T>
  implements BinarySearchTreeInterface<T, BinarySearchTreeNodeInterface<T>> {
  #root: RootBinarySearchTreeNodeInterface<T>;
  #comparator: Comparator<T>;

  get root(): BinarySearchTreeNodeInterface<T> | null {
    if (this.#root instanceof BinarySearchTreeNode) {
      return this.#root;
    }
    return null;
  }

  get comparator(): Comparator<T> {
    return this.#comparator;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    const root = this.root;
    if (root !== null) {
      yield* root;
    }
  }

  constructor(comparator: Comparator<T>) {
    this.#root = new RootBinarySearchTreeNode<T>((value: T) => {
      this.#root = new BinarySearchTreeNode(value, comparator);
    });

    this.#comparator = comparator;
  }

  insert(value: T): boolean {
    return this.#root.insert(value);
  }

  has(value: T): boolean {
    return this.#root.has(value);
  }
}
