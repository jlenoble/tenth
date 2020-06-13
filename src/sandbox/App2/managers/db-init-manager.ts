import { Store, Item, Relationship } from "../server/db";
import { CoreData } from "../server/db/core-data";
import { ItemId, GQLItem, GQLRelationship } from "../types";

export class DBInitManager {
  private store: Store;
  private coreData: CoreData;
  private items: Map<string, GQLItem> = new Map();
  private relationships: Map<string, Set<string>> = new Map();
  private alterTables = false;
  private counter = 0; // item
  private counter2 = 0; // relationship

  constructor({ store, coreData }: { store: Store; coreData: CoreData }) {
    this.store = store;
    this.coreData = coreData;
  }

  async resetTables(): Promise<void> {
    this.alterTables = true;

    for (const tableName of Object.keys(this.store) as (keyof Store)[]) {
      await this.store[tableName].sync({ force: true });
      console.log(`Created or reset ${tableName}`);
    }

    await this.addCoreData();

    this.alterTables = false;
  }

  async addCoreData(): Promise<void> {
    const root = await this._findOrCreateItem("/");
    await this._addData(this.coreData, root);

    const coreItems = await this._findOrCreateItem("Core Items");
    const topItems = this.relationships.get("/");

    if (topItems) {
      for (const item of this.items.values()) {
        if (!topItems.has(item.title) && item.title !== "/") {
          await this._addData(item.title, coreItems);
        }
      }

      for (const title of topItems) {
        if (title !== "Core Items") {
          await this._findOrCreateRelationship(root, "→", title);
        }
      }
    }
  }

  async getItems(): Promise<Map<ItemId, Item>> {
    await this.addCoreData();

    const items: [ItemId, Item][] = [];

    for (const { id } of this.items.values()) {
      const item = await this.store.Item.findOne<Item>({ where: { id } });

      if (item) {
        items.push([id, item]);
      }
    }

    return new Map(items);
  }

  async _addData(data: CoreData, parent: GQLItem): Promise<void> {
    if (typeof data === "string") {
      await this._findOrCreateRelationship(parent, "⊃", data);
    } else if (Array.isArray(data)) {
      for (const datum of data) {
        await this._addData(datum, parent);
      }
    } else {
      for (const title of Object.keys(data)) {
        await this._addData(title, parent);
        const item = await this._findOrCreateItem(title);
        await this._addData(data[title], item);
      }
    }
  }

  async _findOrCreateItem(title: string): Promise<GQLItem> {
    let item = this.items.get(title);

    if (item) {
      return item;
    }

    if (this.alterTables) {
      item = await this.store.Item.create<Item>({
        title,
        userId: 1,
      });
    } else {
      const date = new Date();
      item = {
        id: ++this.counter,
        title,
        userId: 1,
        createdAt: date,
        updatedAt: date,
      };
    }

    this.items.set(title, item);

    return item;
  }

  async _findOrCreateRelationship(
    relatedTo: GQLItem,
    relationTitle: string,
    relatedTitle: string
  ): Promise<GQLRelationship> {
    const relation = await this._findOrCreateItem(relationTitle);
    const related = await this._findOrCreateItem(relatedTitle);
    let relationship: GQLRelationship;
    const ids = [relatedTo.id, relation.id, related.id];

    if (this.alterTables) {
      const [relatedToId, relationId, relatedId] = ids;

      const [_relationship] = await this.store.Relationship.findOrCreate<
        Relationship
      >({
        where: {
          relatedToId,
          relatedId,
          relationId,
        },
      });

      relationship = _relationship.values;

      console.log(`Created ${relatedTitle} of ${relatedTo.title}`);
    } else {
      const date = new Date();
      relationship = {
        id: ++this.counter2,
        ids,
        createdAt: date,
        updatedAt: date,
      };
    }

    if (!this.relationships.has(relatedTo.title)) {
      this.relationships.set(relatedTo.title, new Set());
    }

    const relationships = this.relationships.get(relatedTo.title);

    if (relationships) {
      relationships.add(relatedTitle);
    }

    return relationship;
  }
}
