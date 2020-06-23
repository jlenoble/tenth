/* eslint-disable @typescript-eslint/no-explicit-any */
import { ItemCtor } from "./item";
import { Item } from "../item";
import { Container } from "../container";

export interface ContainerCtor<
  T extends Item,
  Params extends any[] = any[],
  First extends Item = Item,
  Last extends Item = First
> extends ItemCtor<T, Params, First, Last> {
  new (...args: Params): Container<First, Last>;
  create(...args: Params): Container<First, Last>;
}
