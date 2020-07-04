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

  remove(): boolean {
    return false;
  }

  has(): boolean {
    return false;
  }

  equalValue(): boolean {
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

  remove(value: T): boolean {
    const node = this.find(value);

    if (node === null) {
      return false;
    }

    const { parent, left, right } = node;

    if (left === null && right === null) {
      if (parent !== null) {
        parent.removeChild(node);
      } else {
        return false;
      }
    } else if (right !== null) {
      const nextNode = right.findMin();

      if (nextNode !== right) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextNode.parent!.removeChild(nextNode);
        node.setValue(nextNode.value);
      } else {
        node.setValue(right.value);
        node.right = right.right;
      }
    } else if (parent !== null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parent.replaceChild(node, left!);
    } else {
      // BinaryTreeNode.copyNode(childNode, node);
    }

    // Clear the parent of removed node.
    // node.parent = null;

    return true;
  }

  has(value: T): boolean {
    return Boolean(this.find(value));
  }

  find(value: T): BinarySearchTreeNode<T> | null {
    if (this.comparator.equal(this.value, value)) {
      return this;
    }

    if (this.comparator.lessThan(value, this.value) && this.left !== null) {
      return this.left.find(value);
    }

    if (this.comparator.greaterThan(value, this.value) && this.right !== null) {
      return this.right.find(value);
    }

    return null;
  }

  findMin(): BinarySearchTreeNode<T> {
    if (this.left === null) {
      return this;
    }

    return this.left.findMin();
  }

  equalValue(value: T): boolean {
    return this.comparator.equal(this.value, value);
  }
}

export class BinarySearchTree<T> implements BinarySearchTreeInterface<T> {
  #emptyRoot: RootBinarySearchTreeNodeInterface<T>;
  #root: RootBinarySearchTreeNodeInterface<T>;
  #comparator: Comparator<T>;

  protected get root(): BinarySearchTreeNodeInterface<T> | null {
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
    this.#emptyRoot = new RootBinarySearchTreeNode<T>((value: T) => {
      this.#root = new BinarySearchTreeNode(value, comparator);
    });

    this.#root = this.#emptyRoot;
    this.#comparator = comparator;
  }

  insert(value: T): boolean {
    return this.#root.insert(value);
  }

  remove(value: T): boolean {
    const removed = this.#root.remove(value);

    if (!removed && this.#root.equalValue(value)) {
      this.#root = this.#emptyRoot;
      return true;
    }

    return removed;
  }

  has(value: T): boolean {
    return this.#root.has(value);
  }
}
