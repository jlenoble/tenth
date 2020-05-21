import { Store, Item, Relationship } from "../server/db";
import { GQLItem } from "../types";

type Data = string | string[] | { [key: string]: Data };

export const dbCoreData: Data = {
  Rel: ["⊃", "⊂", "→", "←"],
};

export class DBInitManager {
  private store: Store;
  private dbCoreData: Data;
  private items: Map<string, GQLItem> = new Map();
  private alterTables = false;
  private counter = 0;

  constructor({ store, dbCoreData }: { store: Store; dbCoreData: Data }) {
    this.store = store;
    this.dbCoreData = dbCoreData;
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
    await this._addData(this.dbCoreData, root);
  }

  async _addData(data: Data, parent: GQLItem): Promise<void> {
    const has = await this._findOrCreateItem("⊃");

    if (typeof data === "string") {
      const item = await this._findOrCreateItem(data);

      if (this.alterTables) {
        await this.store.Relationship.create<Relationship>({
          relatedToId: parent.id,
          relatedId: item.id,
          relationId: has.id,
        });

        console.log(`Created ${data} of ${parent.title}`);
      }
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
}
