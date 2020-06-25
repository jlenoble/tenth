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

export interface ContainerContainer<
  First extends Item = Item,
  Last extends Item = First,
  InnerContainer extends Container<First, Last> = Container<First, Last>
> extends Container<InnerContainer> {
  size: number;

  keys(): IterableIterator<Item["id"]>;
  values(): IterableIterator<InnerContainer>;

  clear(): void;

  add(first: First, last?: Last): InnerContainer;
  remove(firstId: Item["id"], lastID?: Item["id"]): void;

  has(firstId: Item["id"], lastID?: Item["id"]): boolean;
  get(firstId: Item["id"], lastID?: Item["id"]): InnerContainer | undefined;
}
