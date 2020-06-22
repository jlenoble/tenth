import { Container as ContainerInterface, ContainerCtor, Item } from "../types";

export const Container: ContainerCtor = class Container<T extends Item>
  implements ContainerInterface<T> {
  protected _content: Map<Item["id"], T>;

  get size(): number {
    return this._content.size;
  }

  constructor() {
    this._content = new Map();
  }

  set(id: Item["id"], item: T): void {
    this._content.set(id, item);
  }

  delete(id: Item["id"]): void {
    this._content.delete(id);
  }
};
