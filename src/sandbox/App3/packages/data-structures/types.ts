export interface LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null;
}

export interface LinkedList<T> {
  size: number;
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;

  append(value: T): void;
  prepend(value: T): void;

  deleteHead(): void;
  deleteTail(): void;
}
