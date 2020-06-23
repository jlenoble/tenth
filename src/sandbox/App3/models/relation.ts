import { Item } from "./item";
import {
  Item as ItemInterface,
  Relationship as RelationshipInterface,
  RelationCtor,
} from "../types";
import { Relationship } from "./relationship";

const relations: Set<ItemInterface["id"]> = new Set();

export const Relation: RelationCtor<ItemInterface> = class Relation extends Item {
  static get nItems(): number {
    return relations.size;
  }

  private relationships: Map<string, ItemInterface["id"]>;

  get size(): number {
    const cleanup: string[] = [];

    for (const [key, id] of this.relationships.entries()) {
      if (!Item.has(id)) {
        cleanup.push(key);
      }
    }

    for (const key of cleanup) {
      this.relationships.delete(key);
    }

    return this.relationships.size;
  }

  constructor() {
    super();

    this.relationships = new Map();

    relations.add(this.id);
  }

  destroy(): void {
    relations.delete(this.id);
    this.clear();
    super.destroy();
  }

  clear(): void {
    for (const relationship of this.values()) {
      relationship.destroy();
    }
    this.relationships.clear();
  }

  add(a: ItemInterface, b: ItemInterface): void {
    const relationship = new Relationship(a.id, this.id, b.id);
    this.relationships.set(`${a.id}:${b.id}`, relationship.id);
  }

  remove(a: ItemInterface, b: ItemInterface): void {
    const key = `${a.id}:${b.id}`;
    const relationship = Item.get(this.relationships.get(key) || -1);

    if (relationship) {
      relationship.destroy();
      this.relationships.delete(key);
    }
  }

  *keys(): Generator<ItemInterface["id"], void, unknown> {
    const cleanup: string[] = [];

    for (const [key, id] of this.relationships.entries()) {
      if (Item.has(id)) {
        yield id;
      } else {
        cleanup.push(key);
      }
    }

    for (const key of cleanup) {
      this.relationships.delete(key);
    }
  }

  *values(): Generator<RelationshipInterface, void, unknown> {
    for (const id of this.keys()) {
      yield Item.get(id) as RelationshipInterface;
    }
  }
};
