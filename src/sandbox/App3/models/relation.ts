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

  static create(): Relation {
    return new Relation();
  }

  static clear(): void {
    for (const id of relations) {
      super.destroy(id);
    }
  }

  private relationships: Map<string, ItemInterface["id"]>;

  get size(): number {
    if (Item.has(this.id)) {
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
    } else {
      this.clear();
      return 0;
    }
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

  add(left: ItemInterface, right: ItemInterface): void {
    const relationship = new Relationship(left.id, this.id, right.id);
    this.relationships.set(`${left.id}:${right.id}`, relationship.id);
  }

  remove(leftId: ItemInterface["id"], rightId: ItemInterface["id"]): void {
    const key = `${leftId}:${rightId}`;
    const relationship = Item.get(this.relationships.get(key) || -1);

    if (relationship) {
      relationship.destroy();
      this.relationships.delete(key);
    }
  }

  has(leftId: ItemInterface["id"], rightId: ItemInterface["id"]): boolean {
    return this.relationships.has(`${leftId}:${rightId}`);
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
