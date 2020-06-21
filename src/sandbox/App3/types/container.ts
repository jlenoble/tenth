import { Item } from "./item";

export type Container<T extends Item> = Map<Item["id"], T>;
