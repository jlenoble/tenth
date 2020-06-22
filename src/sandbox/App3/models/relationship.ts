import { Item } from "./item";
import { Item as ItemInterface, ItemCtor } from "../types";

const relationships: Set<ItemInterface["id"]> = new Set();

export const Relationship: ItemCtor<
  ItemInterface,
  [ItemInterface["id"], ItemInterface["id"], ItemInterface["id"]]
> = class Relationship extends Item {
  static get nItems(): number {
    return relationships.size;
  }

  static create(
    a: ItemInterface["id"],
    r: ItemInterface["id"],
    b: ItemInterface["id"]
  ): Relationship {
    return new Relationship(a, r, b);
  }

  static destroy(id: ItemInterface["id"]): void {
    relationships.delete(id);
    super.destroy(id);
  }

  static clear(): void {
    for (const id of relationships) {
      super.destroy(id);
    }
    relationships.clear();
  }

  private readonly a: ItemInterface["id"];
  private readonly r: ItemInterface["id"];
  private readonly b: ItemInterface["id"];

  constructor(
    a: ItemInterface["id"],
    r: ItemInterface["id"],
    b: ItemInterface["id"]
  ) {
    super();

    this.a = a;
    this.r = r;
    this.b = b;

    relationships.add(this.id);
  }

  destroy(): void {
    relationships.delete(this.id);
    super.destroy();
  }
};
