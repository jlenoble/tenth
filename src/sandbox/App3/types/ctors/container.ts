/* eslint-disable @typescript-eslint/no-explicit-any */
import { ItemCtor } from "./item";
import { Item } from "../item";
import { Container } from "../container";

export type ContainerCtor<
  Params extends any[] = any[],
  First extends Item = Item,
  Last extends Item = First
> = ItemCtor<Container<First, Last>, Params>;
