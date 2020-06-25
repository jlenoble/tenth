import { Item } from "./item";
import { Relationship } from "./relationship";
import { Relation } from "./relation";

export interface Category extends Relation {
  title: string;

  getItem(id: Item["id"]): Item | undefined;
  getRelationship(id: Item["id"]): Relationship | undefined;

  itemKeys(): IterableIterator<Item["id"]>;
  itemValues(): IterableIterator<Item>;

  relationshipKeys(): IterableIterator<Item["id"]>;
  relationshipValues(): IterableIterator<Relationship>;
}
