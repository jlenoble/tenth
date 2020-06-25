import { Item } from "./item";
import { Relation } from "./relation";

export interface Category extends Relation {
  title: string;

  itemKeys(): IterableIterator<Item["id"]>;
  itemValues(): IterableIterator<Item>;
}
