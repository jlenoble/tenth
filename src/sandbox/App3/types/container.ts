import { Item } from "./item";

export interface Container extends Item {
  first: Item | null | undefined;
  last: Item | null | undefined;

  firstId: Item["id"] | -1;
  lastId: Item["id"] | -1;
}

export interface ContainerContainer extends Container {
  size: number;

  keys(): IterableIterator<Item["id"]>;
  values(): IterableIterator<Container>;

  clear(): void;

  add(first: Item, last?: Item): Container;
  remove(firstId: Item["id"], lastId?: Item["id"]): void;

  has(firstId: Item["id"], lastId?: Item["id"]): boolean;
  get(firstId: Item["id"], lastId?: Item["id"]): Container | undefined;
}
