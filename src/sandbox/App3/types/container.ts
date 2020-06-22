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
