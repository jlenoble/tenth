/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ItemCtor<T extends Item, Params extends any[] = any[]> {
  nItems: number;

  new (...args: Params): T;
  create(...args: Params): T;
  destroy(id: Item["id"]): void;
  clear(): void;

  has(id: Item["id"]): boolean;
  get(id: Item["id"]): T | undefined;
}

export interface Item {
  id: number;

  destroy(): void;
}
