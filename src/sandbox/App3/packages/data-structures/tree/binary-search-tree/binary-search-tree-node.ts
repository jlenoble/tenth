import { Comparator } from "../../../comparator";
import { BinaryTreeNode } from "../binary-tree-node";
import { BinarySearchTreeNode as BinarySearchTreeNodeInterface } from "./types";

export class BinarySearchTreeNode<T> extends BinaryTreeNode<T>
  implements BinarySearchTreeNodeInterface<T> {
  #comparator: Comparator<T>;

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
  set parent(node: BinarySearchTreeNode<T> | null) {
    super.parent = node;
  }

  get comparator(): Comparator<T> {
    return this.#comparator;
  }

  constructor(value: T, comparator: Comparator<T>) {
    super(value);
    this.#comparator = comparator;
  }

  insert(value: T): boolean {
    return Boolean(this._insert(value));
  }

  remove(value: T): boolean {
    return Boolean(this._remove(value));
  }

  has(value: T): boolean {
    return Boolean(this._find(value));
  }

  _insert(value: T): BinarySearchTreeNode<T> | null {
    if (this.comparator.lessThan(value, this.value)) {
      if (this.left !== null) {
        return this.left._insert(value);
      }

      this.left = new (this.constructor as typeof BinarySearchTreeNode)(
        value,
        this.comparator
      );

      return this.left;
    } else if (this.comparator.greaterThan(value, this.value)) {
      if (this.right !== null) {
        return this.right._insert(value);
      }

      this.right = new (this.constructor as typeof BinarySearchTreeNode)(
        value,
        this.comparator
      );

      return this.right;
    }

    return null;
  }

  _remove(value: T): BinarySearchTreeNode<T> | null {
    const node = this._find(value);

    if (node === null) {
      return null;
    }

    const { parent, left, right } = node;

    if (left === null && right === null) {
      if (parent !== null) {
        parent.removeChild(node);
      }
    } else if (right !== null) {
      const nextNode = right._findMin();

      if (nextNode !== right) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextNode.parent!.removeChild(nextNode);
        node.value = nextNode.value;
      } else {
        node.value = right.value;
        node.right = right.right;
      }
    } else if (parent !== null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parent.replaceChild(node, left!);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node.value = left!.value;
      node.left = null;
    }

    return node;
  }

  _find(value: T): BinarySearchTreeNode<T> | null {
    if (this.comparator.equal(this.value, value)) {
      return this;
    }

    if (this.comparator.lessThan(value, this.value) && this.left !== null) {
      return this.left._find(value);
    }

    if (this.comparator.greaterThan(value, this.value) && this.right !== null) {
      return this.right._find(value);
    }

    return null;
  }

  _findMin(): BinarySearchTreeNode<T> {
    if (this.left === null) {
      return this;
    }

    return this.left._findMin();
  }
}
