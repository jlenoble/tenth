export interface LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null;
}

export interface LinkedListConstructor<T> {
  new (): LinkedList<T>;
}

export interface LinkedList<T> extends Iterable<T> {
  size: number;
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;

  append(value: T): void;
  prepend(value: T): void;

  deleteHead(): void;
  deleteTail(): void;
}
