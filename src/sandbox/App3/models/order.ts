import { Item } from "./item";
import { Relation } from "./relation";
import { Category } from "./category";
import { Order as OrderInterface } from "../types";

const orders: Set<Item["id"]> = new Set();

export class Order extends Relation implements OrderInterface {
  static get nItems(): number {
    return orders.size;
  }

  static create(category: Category, title: string): Order {
    return new Order(category, title);
  }

  static clear(): void {
    for (const id of orders) {
      super.destroy(id);
    }
  }

  private readonly category: Category;

  title: string;

  constructor(category: Category, title: string) {
    super();

    this.category = category;
    this.title = title;

    orders.add(this.id);
  }

  destroy(): void {
    orders.delete(this.id);
    super.destroy();
  }
}
