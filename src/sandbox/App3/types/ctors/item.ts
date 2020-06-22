/* eslint-disable @typescript-eslint/no-explicit-any */
import { Item } from "../item";
import { Container } from "../container";

export interface ItemCtor<
  T extends Item,
  Params extends any[] = any[],
  First extends T = T,
  Last extends First = First
> {
  nItems: number;

  new (...args: Params): T;
  create(...args: Params): T | Container<First, Last>;
  destroy(id: Item["id"]): void;
  clear(): void;

  has(id: Item["id"]): boolean;
  get(id: Item["id"]): T | undefined;
}
