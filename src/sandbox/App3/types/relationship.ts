import { Item } from "./item";
import { Container } from "./container";

export interface Relationship<
  Relation extends Item = Item,
  First extends Item = Item,
  Last extends Item = First
> extends Container<First, Last> {
  relation: Relation | null | undefined;
  relationId: Item["id"] | -1;
}
