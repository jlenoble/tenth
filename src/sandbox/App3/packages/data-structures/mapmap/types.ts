import { Constructor, DataStructure } from "../types";

export type MapMapConstructor<A, B, T> = Constructor<MapMap<A, B, T>>;

export interface MapMap<A, B, T> extends DataStructure<T> {
  get(a: A, b: B): T | undefined;
  set(a: A, b: B, t: T): void;
  has(a: A, b: B): boolean;

  clear(): void;

  getRow(a: A): Map<B, T>;
  getColumn(b: B): Map<A, T>;

  iterateRow(a: A): IterableIterator<T>;
  iterateColumn(b: B): IterableIterator<T>;

  iterateRows(): IterableIterator<Map<B, T>>;
  iterateColumns(): IterableIterator<Map<A, T>>;

  iterateByRow(): IterableIterator<T>;
  iterateByColumn(): IterableIterator<T>;
}
