import {
  Item as BaseItem,
  ItemHooks as BaseItemHooks
} from "../list-item/ListItem/ListItem";

export type Item = BaseItem;

export type ItemHooks = BaseItemHooks & {
  items?: Item[];
  setItems?: (items: Item[]) => void;
  addItem?: (item: Item) => void;
  clearItems?: () => void;
};
