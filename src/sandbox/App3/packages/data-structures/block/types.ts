import { Constructor, DataStructure } from "../types";

export type BlockConstructor<T> = Constructor<Block<T>>;

export interface Block<T> extends DataStructure<T> {
  width: number;
  occupied: number;
  free: number;

  add(item: T, width: number): { free: number; added: boolean };
  delete(item: T): { free: number; deleted: boolean };
  get(item: T): number | undefined;
  has(item: T): boolean;
  clear(): void;
}
