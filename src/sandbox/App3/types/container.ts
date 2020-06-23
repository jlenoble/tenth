/* eslint-disable @typescript-eslint/no-explicit-any */
import { Item } from "./item";

export interface Container<
  First extends Item = Item,
  Last extends Item = First
> extends Item {
  first: First | null | undefined;
  last: Last | null | undefined;

  firstId: Item["id"] | -1;
  lastId: Item["id"] | -1;
}

export interface MapContainer<T extends Item = Item> extends Container<T> {
  keys(): IterableIterator<Item["id"]>;
  values(): IterableIterator<T>;

  clear(): void;

  add(...args: any[]): void;
  remove(...args: any[]): void;
}
