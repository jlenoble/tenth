import {
  Comparator,
  defaultCompare,
  ComparatorFunction,
} from "../../../comparator";
import { BinarySearchTree, BinarySearchTreeNode } from "../binary-search-tree";
import {
  AvlTreeNode as AvlTreeNodeInterface,
  AvlTree as AvlTreeInterface,
} from "./types";

class AvlTreeNode<T> extends BinarySearchTreeNode<T>
  implements AvlTreeNodeInterface<T> {
  #height: number;

  get left(): AvlTreeNode<T> | null {
    return super.left as AvlTreeNode<T> | null;
  }
  set left(node: AvlTreeNode<T> | null) {
    const right = this.right;

    if (node === null) {
      if (right === null) {
        this.#height = 0;
      } else {
        this.#height = right.#height + 1;
      }
    } else {
      if (right === null) {
        this.#height = node.#height + 1;
      } else {
        this.#height = Math.max(node.#height, right.#height) + 1;
      }
    }

    super.left = node;
  }

  get right(): AvlTreeNode<T> | null {
    return super.right as AvlTreeNode<T> | null;
  }
  set right(node: AvlTreeNode<T> | null) {
    const left = this.left;

    if (node === null) {
      if (left === null) {
        this.#height = 0;
      } else {
        this.#height = left.#height + 1;
      }
    } else {
      if (left === null) {
        this.#height = node.#height + 1;
      } else {
        this.#height = Math.max(node.#height, left.#height) + 1;
      }
    }

    super.right = node;
  }

  get parent(): AvlTreeNode<T> | null {
    return super.parent as AvlTreeNode<T> | null;
  }
  set parent(node: AvlTreeNode<T> | null) {
    super.parent = node;
  }

  get root(): AvlTreeNode<T> {
    return super.root as AvlTreeNode<T>;
  }

  get height(): number {
    return this.#height;
  }

  get balanceFactor(): number {
    if (this.left !== null) {
      if (this.right !== null) {
        return this.left.#height - this.right.#height;
      } else {
        return this.#height;
      }
    } else {
      if (this.right !== null) {
        return -this.#height;
      } else {
        return 0;
      }
    }
  }

  updateHeights(): void {
    let height = this.#height;

    let node = this.parent;

    while (node !== null && node.#height <= height) {
      node.#height = height + 1;
      height = node.#height;
      node = node.parent;
    }
  }

  constructor(value: T, comparator: Comparator<T>) {
    super(value, comparator);
    this.#height = 0;
  }

  _find(value: T): AvlTreeNode<T> | null {
    return super._find(value) as AvlTreeNode<T> | null;
  }
}

export class AvlTree<T> extends BinarySearchTree<T>
  implements AvlTreeInterface<T> {
  get root(): AvlTreeNode<T> {
    return super.root as AvlTreeNode<T>;
  }
  set root(node: AvlTreeNode<T>) {
    super.root = node;
  }

  get height(): number {
    return this.root.height;
  }

  constructor(
    values?: Iterable<T>,
    compare: ComparatorFunction<T> = defaultCompare
  ) {
    super(values, compare, AvlTreeNode);
  }

  insert(value: T): boolean {
    let node = super._insert(value) as AvlTreeNode<T> | null;
    const inserted = Boolean(node);

    while (node !== null) {
      this.balance(node);
      node = node.parent;
    }

    return inserted;
  }

  remove(value: T): boolean {
    let node = super._remove(value) as AvlTreeNode<T> | null;
    const removed = node !== null;

    if (this.size > 2) {
      while (node !== null) {
        this.balance(node);
        node = node.parent;
      }
    }

    return removed;
  }

  protected balance(node: AvlTreeNode<T>): void {
    node.updateHeights();

    let balanceFactor = node.balanceFactor;

    if (balanceFactor > 1) {
      if (node.left !== null) {
        balanceFactor = node.left.balanceFactor;

        if (balanceFactor > 0) {
          this.rotateLeftLeft(node);
        } else if (balanceFactor < 0) {
          this.rotateLeftRight(node);
        }
      }
    } else if (balanceFactor < -1) {
      if (node.right !== null) {
        balanceFactor = node.right.balanceFactor;

        if (balanceFactor < 0) {
          this.rotateRightRight(node);
        } else if (balanceFactor > 0) {
          this.rotateRightLeft(node);
        }
      }
    }
  }

  protected rotateLeftLeft(node: AvlTreeNode<T>): void {
    const { left } = node;

    if (left === null) {
      return;
    }

    node.left = null;

    const { parent } = node;

    if (parent !== null) {
      if (parent.left === node) {
        parent.left = left;
      } else {
        parent.right = left;
      }
    } else if (node === this.root) {
      this.root = left;
    }

    const leftRight = left.right;

    if (leftRight !== null) {
      node.left = leftRight;
    }

    left.right = node;
  }

  protected rotateLeftRight(node: AvlTreeNode<T>): void {
    const { left } = node;

    if (left === null) {
      return;
    }

    node.left = null;

    const leftRight = left.right;
    left.right = null;

    if (leftRight !== null) {
      if (leftRight.left !== null) {
        left.right = leftRight.left;
        leftRight.left = null;
      }

      leftRight.left = left;
      node.left = leftRight;

      this.rotateLeftLeft(node);
    }
  }

  protected rotateRightLeft(node: AvlTreeNode<T>): void {
    const { right } = node;

    if (right === null) {
      return;
    }

    node.right = null;

    const rightLeft = right.left;
    right.left = null;

    if (rightLeft !== null) {
      if (rightLeft.right !== null) {
        right.left = rightLeft.right;
        rightLeft.right = null;
      }

      rightLeft.right = right;
      node.right = rightLeft;

      this.rotateRightRight(node);
    }
  }

  protected rotateRightRight(node: AvlTreeNode<T>): void {
    const { right } = node;

    if (right === null) {
      return;
    }

    node.right = null;

    const { parent } = node;

    if (parent !== null) {
      if (parent.left === node) {
        parent.left = right;
      } else {
        parent.right = right;
      }
    } else if (node === this.root) {
      this.root = right;
    }

    const rightLeft = right.left;

    if (rightLeft !== null) {
      node.right = rightLeft;
    }

    right.left = node;
  }
}
