import {
  Item as ItemInterface,
  Container as ContainerInterface,
} from "../types";

let _id = 0;
const tmpId = () => --_id;

const items: ContainerInterface<ItemInterface> = new Map();

export class Item implements ItemInterface {
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
}
