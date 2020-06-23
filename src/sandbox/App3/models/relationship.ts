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
    if (Item.has(this.r)) {
      return this.r;
    } else {
      this.destroy();
      return -1;
    }
  }

  get firstId(): ItemInterface["id"] | -1 {
    if (Item.has(this.a)) {
      return this.a;
    } else {
      this.destroy();
      return -1;
    }
  }

  get lastId(): ItemInterface["id"] | -1 {
    if (Item.has(this.b)) {
      return this.b;
    } else {
      this.destroy();
      return -1;
    }
  }

  get relation(): ItemInterface | null {
    const item = Item.get(this.r);
    if (item) {
      return item;
    } else {
      this.destroy();
      return null;
    }
  }

  get first(): ItemInterface | null {
    const item = Item.get(this.a);
    if (item) {
      return item;
    } else {
      this.destroy();
      return null;
    }
  }

  get last(): ItemInterface | null {
    const item = Item.get(this.b);
    if (item) {
      return item;
    } else {
      this.destroy();
      return null;
    }
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
