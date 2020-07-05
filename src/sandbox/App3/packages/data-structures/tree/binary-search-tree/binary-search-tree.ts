import {
  Comparator,
  defaultCompare,
  ComparatorFunction,
} from "../../../comparator";
import { BinaryTreeNode } from "../binary-tree-node";
import {
  BinarySearchTreeNode as BinarySearchTreeNodeInterface,
  BinarySearchTreeNodeConstructor,
  BinarySearchTree as BinarySearchTreeInterface,
} from "./types";

class EmptyBinarySearchTreeNode<T> implements BinarySearchTreeNodeInterface<T> {
  #initializeTree: (value: T) => void;
  #comparator: Comparator<T>;

  get left(): BinarySearchTreeNodeInterface<T> | null {
    return null;
  }

  get right(): BinarySearchTreeNodeInterface<T> | null {
    return null;
  }

  get parent(): BinarySearchTreeNodeInterface<T> | null {
    return null;
  }

  get root(): BinarySearchTreeNodeInterface<T> {
    return this;
  }

  get value(): T {
    throw new Error("EmptyBinarySearchTreeNode cannot hold any value");
  }

  get comparator(): Comparator<T> {
    return this.#comparator;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  *[Symbol.iterator](): IterableIterator<T> {}

  constructor(initializeTree: (value: T) => void, comparator: Comparator<T>) {
    this.#initializeTree = initializeTree;
    this.#comparator = comparator;
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

  find(): BinarySearchTreeNode<T> | null {
    return null;
  }
}

export class BinarySearchTreeNode<T> extends BinaryTreeNode<T>
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

      this.left = new (this.constructor as typeof BinarySearchTreeNode)(
        value,
        this.comparator
      );
      return true;
    } else if (this.comparator.greaterThan(value, this.value)) {
      if (this.right !== null) {
        return this.right.insert(value);
      }

      this.right = new (this.constructor as typeof BinarySearchTreeNode)(
        value,
        this.comparator
      );
      return true;
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
    }

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
  #emptyRoot: BinarySearchTreeNodeInterface<T>;
  #root: BinarySearchTreeNodeInterface<T>;
  #comparator: Comparator<T>;
  #size: number;

  protected get root(): BinarySearchTreeNodeInterface<T> {
    return this.#root;
  }
  protected setRoot(node: BinarySearchTreeNodeInterface<T>): void {
    this.#root = node;
  }

  get comparator(): Comparator<T> {
    return this.#comparator;
  }

  get size(): number {
    return this.#size;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.#root;
  }

  constructor(
    values?: Iterable<T>,
    compare: ComparatorFunction<T> = defaultCompare,
    Node: BinarySearchTreeNodeConstructor<T> = BinarySearchTreeNode
  ) {
    this.#comparator = new Comparator(compare);
    this.#size = 0;

    this.#emptyRoot = new EmptyBinarySearchTreeNode<T>((value: T) => {
      this.#root = new Node(value, this.#comparator);
    }, this.#comparator);

    this.#root = this.#emptyRoot;

    if (values !== undefined) {
      for (const value of values) {
        this.insert(value);
      }
    }
  }

  isEmpty(): boolean {
    return this.#size === 0;
  }

  insert(value: T): boolean {
    if (this.#root.insert(value)) {
      this.#size++;
      return true;
    }
    return false;
  }

  remove(value: T): boolean {
    let removed = this.#root.remove(value);

    if (!removed && this.#root.equalValue(value)) {
      this.#root = this.#emptyRoot;
      removed = true;
    }

    if (removed) {
      this.#size--;
    }

    return removed;
  }

  has(value: T): boolean {
    return this.#root.has(value);
  }
}
