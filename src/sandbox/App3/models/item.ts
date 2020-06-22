import {
  Item as ItemInterface,
  ItemCtor,
  Container as ContainerInterface,
} from "../types";
import { Container } from "./container";

let _id = 0;
const tmpId = () => ++_id;

const items: ContainerInterface<ItemInterface> = new Container();

export const Item: ItemCtor<ItemInterface> = class Item
  implements ItemInterface {
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
