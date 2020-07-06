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
  #initializeTree: (value: T) => BinarySearchTreeNodeInterface<T>;
  #comparator: Comparator<T>;

  get left(): BinarySearchTreeNodeInterface<T> | null {
    throw new Error(
      "EmptyBinarySearchTreeNode getters should not be ever called"
    );
  }

  get right(): BinarySearchTreeNodeInterface<T> | null {
    throw new Error(
      "EmptyBinarySearchTreeNode getters should not be ever called"
    );
  }

  get parent(): BinarySearchTreeNodeInterface<T> | null {
    throw new Error(
      "EmptyBinarySearchTreeNode getters should not be ever called"
    );
  }

  get root(): BinarySearchTreeNodeInterface<T> {
    throw new Error(
      "EmptyBinarySearchTreeNode getters should not be ever called"
    );
  }

  get value(): T {
    throw new Error("EmptyBinarySearchTreeNode cannot hold any value");
  }

  get comparator(): Comparator<T> {
    throw new Error(
      "EmptyBinarySearchTreeNode getters should not be ever called"
    );
  }

  *[Symbol.iterator](): IterableIterator<T> {
    // Empty trees call this method, don't throw
  }

  constructor(
    initializeTree: (value: T) => BinarySearchTreeNodeInterface<T>,
    comparator: Comparator<T>
  ) {
    this.#initializeTree = initializeTree;
    this.#comparator = comparator;
  }

  insert(value: T): boolean {
    this.#initializeTree(value);
    return true;
  }

  _insert(value: T): BinarySearchTreeNodeInterface<T> | null {
    return this.#initializeTree(value);
  }

  remove(): boolean {
    throw new Error("EmptyBinarySearchTreeNode cannot remove anything");
  }

  has(): boolean {
    throw new Error(
      "EmptyBinarySearchTreeNode 'has' method should not be called"
    );
  }

  _remove(): BinarySearchTreeNodeInterface<T> | null {
    throw new Error("EmptyBinarySearchTreeNode cannot remove anything");
  }

  _find(): BinarySearchTreeNodeInterface<T> | null {
    throw new Error("EmptyBinarySearchTreeNode cannot find anything");
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
        node.setValue(nextNode.value);
      } else {
        node.setValue(right.value);
        node.right = right.right;
      }
    } else if (parent !== null) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parent.replaceChild(node, left!);
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
      return this.#root;
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
    return Boolean(this._insert(value));
  }

  remove(value: T): boolean {
    return Boolean(this._remove(value));
  }

  has(value: T): boolean {
    return this.#root.has(value);
  }

  _insert(value: T): BinarySearchTreeNodeInterface<T> | null {
    const node = this.#root._insert(value);

    if (node !== null) {
      this.#size++;
    }

    return node;
  }

  _remove(value: T): BinarySearchTreeNodeInterface<T> | null {
    const node = this.#root._remove(value);

    if (node === this.#root && this.#size === 1) {
      this.#root = this.#emptyRoot;
    }

    if (node !== null) {
      this.#size--;
    }

    return node;
  }
}
