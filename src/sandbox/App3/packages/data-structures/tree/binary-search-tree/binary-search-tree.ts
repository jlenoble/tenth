import {
  Comparator,
  defaultCompare,
  ComparatorFunction,
} from "../../../comparator";
import { BinarySearchTreeNode } from "./binary-search-tree-node";
import { EmptyBinarySearchTreeNode } from "./empty-binary-search-tree-node";
import {
  BinarySearchTreeNode as BinarySearchTreeNodeInterface,
  BinarySearchTreeNodeConstructor,
  BinarySearchTree as BinarySearchTreeInterface,
} from "./types";

export class BinarySearchTree<T> implements BinarySearchTreeInterface<T> {
  #emptyRoot: BinarySearchTreeNodeInterface<T>;
  #root: BinarySearchTreeNodeInterface<T>;
  #comparator: Comparator<T>;
  #size: number;

  protected get root(): BinarySearchTreeNodeInterface<T> {
    return this.#root;
  }
  protected set root(node: BinarySearchTreeNodeInterface<T>) {
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

  *dftNodeIterate(): IterableIterator<BinarySearchTreeNodeInterface<T>> {
    yield* this.#root.dftNodeIterate() as IterableIterator<
      BinarySearchTreeNodeInterface<T>
    >;
  }

  *bftNodeIterate(): IterableIterator<BinarySearchTreeNodeInterface<T>> {
    yield* this.#root.bftNodeIterate() as IterableIterator<
      BinarySearchTreeNodeInterface<T>
    >;
  }

  _insert(value: T): BinarySearchTreeNodeInterface<T> | null {
    const node = this.#root._insert(value);

    if (node !== null) {
      this.#size++;
    }

    return node;
  }

  _remove(value: T): BinarySearchTreeNodeInterface<T> | null {
    if (this.#size > 0) {
      const node = this.#root._remove(value);

      if (node === this.#root && this.#size === 1) {
        this.#root = this.#emptyRoot;
      }

      if (node !== null) {
        this.#size--;
      }

      return node;
    }

    return null;
  }
}
