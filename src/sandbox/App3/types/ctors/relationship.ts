/* eslint-disable @typescript-eslint/no-explicit-any */
import { Item } from "../item";
import { ContainerCtor } from "./container";
import { Relationship } from "../relationship";

export interface RelationshipCtor<
  Relation extends Item,
  First extends Item = Item,
  Last extends Item = First
>
  extends ContainerCtor<
    Relation,
    [Item["id"], Item["id"], Item["id"]],
    First,
    Last
  > {
  new (...args: [Item["id"], Item["id"], Item["id"]]): Relationship<
    Relation,
    First,
    Last
  >;

  create(
    a: Item["id"],
    r: Item["id"],
    b: Item["id"]
  ): Relationship<Relation, First, Last>;
}
