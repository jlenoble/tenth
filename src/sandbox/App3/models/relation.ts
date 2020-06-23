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

  private relationships: Set<ItemInterface["id"]>;

  constructor() {
    super();

    this.relationships = new Set();

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
  }

  add(a: ItemInterface, b: ItemInterface): void {
    const relationship = new Relationship(a.id, this.id, b.id);
    this.relationships.add(relationship.id);
  }

  *keys(): Generator<ItemInterface["id"], void, unknown> {
    const cleanup: ItemInterface["id"][] = [];

    for (const id of this.relationships.values()) {
      if (Item.has(id)) {
        yield id;
      } else {
        cleanup.push(id);
      }
    }

    for (const id of cleanup) {
      this.relationships.delete(id);
    }
  }

  *values(): Generator<RelationshipInterface, void, unknown> {
    for (const id of this.keys()) {
      yield Item.get(id) as RelationshipInterface;
    }
  }
};
