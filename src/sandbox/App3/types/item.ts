/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ItemCtor<T extends Item> {
  nItems: number;

  new (...args: any[]): T;
  create(...args: any[]): T;
  destroy(id: Item["id"]): void;

  has(id: Item["id"]): boolean;
  get(id: Item["id"]): T | undefined;
}

export interface Item {
  id: number;

  destroy(): void;
}
