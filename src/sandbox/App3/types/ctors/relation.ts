/* eslint-disable @typescript-eslint/no-explicit-any */
import { Item } from "../item";
import { MapContainerCtor } from "./container";
import { Relationship } from "../relationship";
import { Relation } from "../relation";

export interface RelationCtor<
  First extends Item = Item,
  Last extends Item = First
>
  extends MapContainerCtor<
    [],
    Relationship<Relation<First, Last>, First, Last>
  > {
  new (): Relation<First, Last>;
  create(): Relation<First, Last>;
}
