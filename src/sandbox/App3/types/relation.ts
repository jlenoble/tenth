import { Item } from "./item";
import { MapContainer } from "./container";
import { Relationship } from "./relationship";

export interface Relation<First extends Item = Item, Last extends Item = First>
  extends MapContainer<Relationship<Relation<First, Last>, First, Last>> {
  firstKeys(): IterableIterator<Item["id"]>;
  firstValues(): IterableIterator<First>;

  lastKeys(): IterableIterator<Item["id"]>;
  lastValues(): IterableIterator<Last>;
}
