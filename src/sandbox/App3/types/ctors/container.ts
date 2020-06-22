/* eslint-disable @typescript-eslint/no-explicit-any */
import { ItemCtor } from "./item";
import { Item } from "../item";
import { Container } from "../container";

export interface ContainerCtor<
  T extends Item,
  Params extends any[] = any[],
  First extends T = T,
  Last extends First = First
> extends ItemCtor<T, Params> {
  new (...args: Params): Container<First, Last>;
  create(...args: Params): Container<First, Last>;
}
