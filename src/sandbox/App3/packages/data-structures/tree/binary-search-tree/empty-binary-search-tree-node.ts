import { Comparator } from "../../../comparator";
import { BinarySearchTreeNode as BinarySearchTreeNodeInterface } from "./types";

export class EmptyBinarySearchTreeNode<T>
  implements BinarySearchTreeNodeInterface<T> {
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

  *dftNodeIterate(): IterableIterator<BinarySearchTreeNodeInterface<T>> {
    // Empty trees call this method, don't throw
  }

  *bftNodeIterate(): IterableIterator<BinarySearchTreeNodeInterface<T>> {
    // Empty trees call this method, don't throw
  }

  *dftNodeIterateWithDepth(): IterableIterator<{
    node: BinarySearchTreeNodeInterface<T>;
    depth: number;
  }> {
    // Empty trees call this method, don't throw
  }

  *bftNodeIterateWithDepth(): IterableIterator<{
    node: BinarySearchTreeNodeInterface<T>;
    depth: number;
  }> {
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

  _remove(): BinarySearchTreeNodeInterface<T> | null {
    throw new Error("EmptyBinarySearchTreeNode cannot remove anything");
  }

  removeChild(): boolean {
    throw new Error("EmptyBinarySearchTreeNode cannot remove anything");
  }

  replaceChild(): boolean {
    throw new Error("EmptyBinarySearchTreeNode cannot replace anything");
  }

  has(): boolean {
    return false;
  }

  _find(): BinarySearchTreeNodeInterface<T> | null {
    throw new Error("EmptyBinarySearchTreeNode cannot find anything");
  }

  _findMin(): BinarySearchTreeNodeInterface<T> {
    throw new Error("EmptyBinarySearchTreeNode cannot find anything");
  }

  toString(): string {
    return "└─ null";
  }
}
