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

  private relationships: Map<string, RelationshipInterface>;
  private firstKey: string;
  private lastKey: string;

  private _doCleanup(keys: string[] = []): void {
    for (const key of keys) {
      this.relationships.delete(key);
    }

    if (this.relationships.size) {
      const iterator = this.relationships.keys();
      this.firstKey = iterator.next().value;

      for (const key of iterator) {
        this.lastKey = key;
      }
    } else {
      this.firstKey = "";
      this.lastKey = "";
    }
  }

  private *_autoCleanupCollect(
    idKey: "id" | "firstId" | "lastId"
  ): Generator<ItemInterface["id"], void, unknown> {
    const cleanup: string[] = [];

    for (const [key, { id }] of this.relationships.entries()) {
      const relationship = Item.get(id) as RelationshipInterface | undefined;

      if (relationship?.valid) {
        yield relationship[idKey];
      } else {
        cleanup.push(key);
      }
    }

    this._doCleanup(cleanup);
  }

  private _autoCleanupGet(
    key: string
  ): RelationshipInterface | null | undefined {
    const relationship = this.relationships.get(key);

    if (relationship?.valid) {
      return relationship as RelationshipInterface;
    } else {
      const keys: string[] = [key];

      for (const [key, relationship] of this.relationships) {
        if (relationship?.valid) {
          break;
        }
        keys.push(key);
      }

      this._doCleanup(keys);

      return null;
    }
  }

  get firstId(): ItemInterface["id"] | -1 {
    return this.first?.id || -1;
  }

  get lastId(): ItemInterface["id"] | -1 {
    return this.last?.id || -1;
  }

  get first(): RelationshipInterface | undefined {
    const relationship = this._autoCleanupGet(this.firstKey);
    if (relationship === null) {
      return this.relationships.get(this.firstKey);
    }
    return relationship;
  }

  get last(): RelationshipInterface | undefined {
    const relationship = this._autoCleanupGet(this.lastKey);
    if (relationship === null) {
      return this.relationships.get(this.lastKey);
    }
    return relationship;
  }

  get size(): number {
    if (Item.has(this.id)) {
      const cleanup: string[] = [];

      for (const [key, relationship] of this.relationships.entries()) {
        if (!relationship?.valid) {
          cleanup.push(key);
        }
      }

      this._doCleanup(cleanup);

      return this.relationships.size;
    } else {
      this.clear();
      return 0;
    }
  }

  constructor() {
    super();

    this.relationships = new Map();
    this.firstKey = "";
    this.lastKey = "";

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
    this.firstKey = "";
    this.lastKey = "";
  }

  add(left: ItemInterface, right: ItemInterface): RelationshipInterface {
    const key = `${left.id}:${right.id}`;
    const relationship = new Relationship(left.id, this.id, right.id);

    this.relationships.set(key, relationship);

    if (!this.firstKey) {
      this.firstKey = key;
    }

    this.lastKey = key;

    return relationship;
  }

  remove(leftId: ItemInterface["id"], rightId: ItemInterface["id"]): void {
    const key = `${leftId}:${rightId}`;
    const relationship = this.relationships.get(key);

    if (relationship) {
      relationship.destroy();
      this._doCleanup([`${leftId}:${rightId}`]);
    }
  }

  has(leftId: ItemInterface["id"], rightId: ItemInterface["id"]): boolean {
    return Boolean(this.get(leftId, rightId));
  }

  get(
    leftId: ItemInterface["id"],
    rightId: ItemInterface["id"]
  ): RelationshipInterface | undefined {
    const relationship = this._autoCleanupGet(`${leftId}:${rightId}`);
    if (relationship) {
      return relationship;
    }
  }

  *keys(): Generator<ItemInterface["id"], void, unknown> {
    yield* this._autoCleanupCollect("id");
  }

  *values(): Generator<RelationshipInterface, void, unknown> {
    for (const id of this.keys()) {
      yield Item.get(id) as RelationshipInterface;
    }
  }

  *firstKeys(): Generator<ItemInterface["id"], void, unknown> {
    yield* this._autoCleanupCollect("firstId");
  }

  *firstValues(): Generator<ItemInterface, void, unknown> {
    for (const id of this.firstKeys()) {
      yield Item.get(id) as ItemInterface;
    }
  }

  *lastKeys(): Generator<ItemInterface["id"], void, unknown> {
    yield* this._autoCleanupCollect("lastId");
  }

  *lastValues(): Generator<ItemInterface, void, unknown> {
    for (const id of this.lastKeys()) {
      yield Item.get(id) as ItemInterface;
    }
  }
};
