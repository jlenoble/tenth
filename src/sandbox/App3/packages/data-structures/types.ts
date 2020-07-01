export interface Node<T> {
  value: T;
}

export interface Constructor<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

export interface DataStructure<T> extends Iterable<T> {
  size: number;
  isEmpty(): boolean;
}
