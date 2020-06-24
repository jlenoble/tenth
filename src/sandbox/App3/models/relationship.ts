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

  static clear(): void {
    for (const id of relationships) {
      super.destroy(id);
    }
  }

  private readonly a: ItemInterface["id"];
  private readonly r: ItemInterface["id"];
  private readonly b: ItemInterface["id"];

  private _autoCleanGetId(id: ItemInterface["id"]): ItemInterface["id"] | -1 {
    if (relationships.has(this.id) && Item.has(id)) {
      return id;
    } else {
      this.destroy();
      return -1;
    }
  }

  private _autoCleanGet(id: ItemInterface["id"]): ItemInterface | null {
    return Item.get(this._autoCleanGetId(id)) || null;
  }

  get valid(): boolean {
    return Item.has(this.a) && Item.has(this.r) && Item.has(this.b);
  }

  get relationId(): ItemInterface["id"] | -1 {
    return this._autoCleanGetId(this.r);
  }

  get firstId(): ItemInterface["id"] | -1 {
    return this._autoCleanGetId(this.a);
  }

  get lastId(): ItemInterface["id"] | -1 {
    return this._autoCleanGetId(this.b);
  }

  get relation(): ItemInterface | null {
    return this._autoCleanGet(this.r);
  }

  get first(): ItemInterface | null {
    return this._autoCleanGet(this.a);
  }

  get last(): ItemInterface | null {
    return this._autoCleanGet(this.b);
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
