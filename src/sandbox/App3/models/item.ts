import { Item as ItemInterface } from "../types";

let _id = 0;
const tmpId = () => ++_id;

const items: Map<ItemInterface["id"], ItemInterface> = new Map();

export class Item implements ItemInterface {
  static get nItems(): number {
    return items.size;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  static create(...args: any[]): Item {
    return new Item();
  }

  static destroy(id: ItemInterface["id"]): void {
    const item = items.get(id);

    if (item) {
      item.destroy();
    }
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

  get valid(): boolean {
    return true;
  }

  constructor() {
    this.id = tmpId();
    items.set(this.id, this);
  }

  destroy(): void {
    items.delete(this.id);
  }
}
