export interface Node<T> {
  value: T;
}

export interface Constructor<T> {
  new (): T;
}

export interface DataStructure<T, N extends Node<T>> extends Iterable<T> {
  size: number;
  head: T | undefined;
  tail: T | undefined;

  append(value: T): this;
  prepend(value: T): this;
  deleteHead(): N | null;
  deleteTail(): N | null;

  isEmpty(): boolean;
  peek(): T | undefined;
  push(...values: T[]): number;
  pop(): T | undefined;
  enqueue(...values: T[]): number;
  dequeue(): T | undefined;
}
