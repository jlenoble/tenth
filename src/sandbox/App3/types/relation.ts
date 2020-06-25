import { Item } from "./item";
import { ContainerContainer } from "./container";

export interface Relation extends ContainerContainer {
  firstKeys(): IterableIterator<Item["id"]>;
  firstValues(): IterableIterator<Item>;

  lastKeys(): IterableIterator<Item["id"]>;
  lastValues(): IterableIterator<Item>;
}
