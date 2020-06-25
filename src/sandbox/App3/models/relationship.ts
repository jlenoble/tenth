import { Item } from "./item";
import { Relationship as RelationshipInterface, Relation } from "../types";

const relationships: Set<Item["id"]> = new Set();

export class Relationship extends Item implements RelationshipInterface {
  static get nItems(): number {
    return relationships.size;
  }

  static create(a: Item["id"], r: Item["id"], b: Item["id"]): Relationship {
    return new Relationship(a, r, b);
  }

  static clear(): void {
    for (const id of relationships) {
      super.destroy(id);
    }
  }

  private readonly a: Item["id"];
  private readonly r: Item["id"];
  private readonly b: Item["id"];

  private _autoCleanGetId(id: Item["id"]): Item["id"] | -1 {
    if (relationships.has(this.id) && Item.has(id)) {
      return id;
    } else {
      this.destroy();
      return -1;
    }
  }

  private _autoCleanGet(id: Item["id"]): Item | null {
    return Item.get(this._autoCleanGetId(id)) || null;
  }

  get valid(): boolean {
    return (
      Item.has(this.id) &&
      Item.has(this.a) &&
      Item.has(this.r) &&
      Item.has(this.b)
    );
  }

  get relationId(): Item["id"] | -1 {
    return this._autoCleanGetId(this.r);
  }

  get firstId(): Item["id"] | -1 {
    return this._autoCleanGetId(this.a);
  }

  get lastId(): Item["id"] | -1 {
    return this._autoCleanGetId(this.b);
  }

  get relation(): Relation | null {
    return this._autoCleanGet(this.r) as Relation;
  }

  get first(): Item | null {
    return this._autoCleanGet(this.a);
  }

  get last(): Item | null {
    return this._autoCleanGet(this.b);
  }

  constructor(a: Item["id"], r: Item["id"], b: Item["id"]) {
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
}
