/* eslint-disable @typescript-eslint/no-explicit-any */
import { Item } from "../item";
import { ContainerContainerCtor } from "./container";
import { Relationship } from "../relationship";
import { Relation } from "../relation";

export interface RelationCtor<
  First extends Item = Item,
  Last extends Item = First,
  Params extends any[] = any[]
>
  extends ContainerContainerCtor<
    Params,
    Relationship<Relation<First, Last>, First, Last>
  > {
  new (...args: Params): Relation<First, Last>;
  create(...args: Params): Relation<First, Last>;
}
