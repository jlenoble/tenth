import { Item } from "./item";

export interface Container<T extends Item> {
  readonly size: number;

  set(id: Item["id"], item: T): void;
  delete(id: Item["id"]): void;
}
