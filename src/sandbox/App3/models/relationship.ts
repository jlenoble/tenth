import { Item } from "./item";
import { Item as ItemInterface, RelationshipCtor } from "../types";

const relationships: Set<ItemInterface["id"]> = new Set();

export const Relationship: RelationshipCtor<ItemInterface> = class Relationship extends Item {
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

  get relationId(): ItemInterface["id"] | -1 {
    return Item.has(this.r) ? this.r : -1;
  }

  get firstId(): ItemInterface["id"] | -1 {
    return Item.has(this.a) ? this.a : -1;
  }

  get lastId(): ItemInterface["id"] | -1 {
    return Item.has(this.b) ? this.b : -1;
  }

  get relation(): ItemInterface | null {
    return Item.get(this.r) || null;
  }

  get first(): ItemInterface | null {
    return Item.get(this.a) || null;
  }

  get last(): ItemInterface | null {
    return Item.get(this.b) || null;
  }

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
