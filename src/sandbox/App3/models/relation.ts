import { Item } from "./item";
import { Relationship } from "./relationship";
import { Relation as RelationInterface } from "../types";

const relations: Set<Item["id"]> = new Set();

export class Relation extends Item implements RelationInterface {
  static get nItems(): number {
    return relations.size;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  static create(...args: any[]): Relation {
    return new Relation();
  }

  static clear(): void {
    for (const id of relations) {
      super.destroy(id);
    }
  }

  static has(id: Item["id"]): boolean {
    return relations.has(id);
  }

  static get(id: Item["id"]): Item | undefined {
    if (relations.has(id)) {
      return Item.get(id);
    }
  }

  private relationships: Map<string, Relationship>;
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
  ): Generator<Item["id"], void, unknown> {
    const cleanup: string[] = [];

    for (const [key, { id }] of this.relationships.entries()) {
      const relationship = Item.get(id) as Relationship | undefined;

      if (relationship?.valid) {
        yield relationship[idKey];
      } else {
        cleanup.push(key);
      }
    }

    this._doCleanup(cleanup);
  }

  private _autoCleanupGet(key: string): Relationship | null | undefined {
    const relationship = this.relationships.get(key);

    if (relationship?.valid) {
      return relationship as Relationship;
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

  get firstId(): Item["id"] | -1 {
    return this.first?.id || -1;
  }

  get lastId(): Item["id"] | -1 {
    return this.last?.id || -1;
  }

  get first(): Relationship | undefined {
    const relationship = this._autoCleanupGet(this.firstKey);
    if (relationship === null) {
      return this.relationships.get(this.firstKey);
    }
    return relationship;
  }

  get last(): Relationship | undefined {
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

  add(left: Item, right: Item): Relationship {
    const key = `${left.id}:${right.id}`;
    let relationship = this.relationships.get(key);

    if (!relationship) {
      relationship = new Relationship(left.id, this.id, right.id);

      this.relationships.set(key, relationship);

      if (!this.firstKey) {
        this.firstKey = key;
      }

      this.lastKey = key;
    }

    return relationship;
  }

  remove(leftId: Item["id"], rightId: Item["id"]): void {
    const key = `${leftId}:${rightId}`;
    const relationship = this.relationships.get(key);

    if (relationship) {
      relationship.destroy();
      this._doCleanup([`${leftId}:${rightId}`]);
    }
  }

  has(leftId: Item["id"], rightId: Item["id"]): boolean {
    return Boolean(this.get(leftId, rightId));
  }

  get(leftId: Item["id"], rightId: Item["id"]): Relationship | undefined {
    const relationship = this._autoCleanupGet(`${leftId}:${rightId}`);
    if (relationship) {
      return relationship;
    }
  }

  *keys(): Generator<Item["id"], void, unknown> {
    yield* this._autoCleanupCollect("id");
  }

  *values(): Generator<Relationship, void, unknown> {
    for (const id of this.keys()) {
      yield Item.get(id) as Relationship;
    }
  }

  *firstKeys(): Generator<Item["id"], void, unknown> {
    yield* this._autoCleanupCollect("firstId");
  }

  *firstValues(): Generator<Item, void, unknown> {
    for (const id of this.firstKeys()) {
      yield Item.get(id) as Item;
    }
  }

  *lastKeys(): Generator<Item["id"], void, unknown> {
    yield* this._autoCleanupCollect("lastId");
  }

  *lastValues(): Generator<Item, void, unknown> {
    for (const id of this.lastKeys()) {
      yield Item.get(id) as Item;
    }
  }
}
