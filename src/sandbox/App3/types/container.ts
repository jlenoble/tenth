import { Item } from "./item";

export interface ContainerCtor {
  new <T extends Item>(): Container<T>;
}

export interface Container<T extends Item> {
  readonly size: number;

  set(id: Item["id"], item: T): void;
  delete(id: Item["id"]): void;
}
