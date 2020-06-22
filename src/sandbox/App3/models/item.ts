import { Item as ItemInterface, ItemCtor, Container } from "../types";

let _id = 0;
const tmpId = () => ++_id;

const items: Container<ItemInterface> = new Map();

export const Item: ItemCtor = class Item implements ItemInterface {
  static get nItems(): number {
    return items.size;
  }

  readonly id: number;
  readonly title: string;

  constructor(title: string) {
    this.id = tmpId();
    this.title = title;

    items.set(this.id, this);
  }

  destroy(): void {
    items.delete(this.id);
  }
};
