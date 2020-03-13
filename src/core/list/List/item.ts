import {
  Item as BaseItem,
  ItemHooks as BaseItemHooks
} from "../list-item/ListItem/ListItem";
import { RequiredKeys } from "../../../generics";

export type Item = BaseItem;

export type ItemHooks = BaseItemHooks & {
  items?: Item[];
  setItems?: (items: Item[]) => void;
  addItem?: (item: Item) => void;
  updateItem?: (item: RequiredKeys<Partial<Item>, "id">) => void;
  clearItems?: () => void;
};
