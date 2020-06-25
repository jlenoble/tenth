import { Item } from "./item";
import { Relation } from "./relation";

export interface Category extends Relation {
  title: string;

  itemIds(): IterableIterator<Item["id"]>;
  items(): IterableIterator<Item>;
}
