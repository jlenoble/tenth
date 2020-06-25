/* eslint-disable @typescript-eslint/no-explicit-any */
import { ItemCtor } from "./item";
import { Item } from "../item";
import { Container } from "../container";

export type ContainerCtor<
  Params extends any[] = any[],
  First extends Item = Item,
  Last extends Item = First
> = ItemCtor<Container<First, Last>, Params>;

export type ContainerContainerCtor<
  Params extends any[] = any[],
  T extends Item = Item
> = ContainerCtor<Params, T>;
