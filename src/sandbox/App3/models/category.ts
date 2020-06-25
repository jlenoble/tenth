import { Item } from "./item";
import { Relationship } from "./relationship";
import { Relation } from "./relation";
import { Category as CategoryInterface } from "../types";

const categories: Set<Item["id"]> = new Set();

export class Category extends Relation implements CategoryInterface {
  static get nItems(): number {
    return categories.size;
  }

  static create(title: string): Category {
    return new Category(title);
  }

  static clear(): void {
    for (const id of categories) {
      super.destroy(id);
    }
  }

  title: string;

  constructor(title: string) {
    super();

    this.title = title;

    categories.add(this.id);
  }

  destroy(): void {
    categories.delete(this.id);
    super.destroy();
  }

  add(item: Item): Relationship {
    return super.add(item, this);
  }

  remove(id: Item["id"]): void {
    super.remove(id, this.id);
  }

  has(id: Item["id"]): boolean {
    return super.has(id, this.id);
  }

  get(id: Item["id"]): Relationship | undefined {
    return super.get(id, this.id);
  }

  getItem(id: Item["id"]): Item | undefined {
    const relationship = super.get(id, this.id);
    return relationship?.first || undefined;
  }

  getRelationship(id: Item["id"]): Relationship | undefined {
    return super.get(id, this.id);
  }

  *itemKeys(): Generator<Item["id"], void, undefined> {
    yield* super.firstKeys();
  }

  *itemValues(): Generator<Item, void, undefined> {
    yield* super.firstValues();
  }

  *relationshipKeys(): Generator<Item["id"], void, undefined> {
    yield* super.keys();
  }

  *relationshipValues(): Generator<Relationship, void, undefined> {
    yield* super.values();
  }
}
