import { Item } from "./item";
import { Category } from "./category";

export interface Order extends Category {
  getCategory(): Category;
  compare(leftId: Item["id"], rightId: Item["id"]): -1 | 0 | 1 | undefined;
}
