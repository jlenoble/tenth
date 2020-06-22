/* eslint-disable @typescript-eslint/no-explicit-any */
import { Item } from "./item";
import { Container } from "./container";

export interface Relationship<
  Relation extends Item = Item,
  First extends Relation = Relation,
  Last extends First = First
> extends Container<First, Last> {
  relation: Relation | null | undefined;
  relationId: Item["id"] | -1;
}
