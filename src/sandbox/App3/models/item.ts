import { Item as ItemInterface, ItemCtor } from "../types";

let _id = 0;
const tmpId = () => ++_id;

const items: Map<ItemInterface["id"], ItemInterface> = new Map();

export const Item: ItemCtor<ItemInterface> = class Item
  implements ItemInterface {
  static get nItems(): number {
    return items.size;
  }

  static create(): Item {
    return new Item();
  }

  static destroy(id: ItemInterface["id"]): void {
    items.delete(id);
  }

  static clear(): void {
    for (const item of items.values()) {
      item.destroy();
    }
  }

  static has(id: ItemInterface["id"]): boolean {
    return items.has(id);
  }

  static get(id: ItemInterface["id"]): Item | undefined {
    return items.get(id);
  }

  readonly id: ItemInterface["id"];

  constructor() {
    this.id = tmpId();
    items.set(this.id, this);
  }

  destroy(): void {
    items.delete(this.id);
  }
};
