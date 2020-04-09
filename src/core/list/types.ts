import { RequiredKeys } from "../../generics";

export interface Item {
  id: string;
  text: string;
  checked: boolean;
  edited: boolean;
}

export interface ItemHooks {
  items: Item[];
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  checkItem?: (id: string) => void;
  editItem?: (id: string) => void;
  stopEditing?: () => void;
  updateItem?: (item: RequiredKeys<Partial<Item>, "id">) => void;
  updateItemAndStopEditing?: (item: RequiredKeys<Partial<Item>, "id">) => void;
}

export interface UI {
  addItem?: boolean;
  checkbox?: boolean;
  deleteButton?: boolean;
  editableText?: boolean;
}

export type Props<T> = T & { itemHooks: ItemHooks; ui?: UI };
export type PropsWithItem<T> = T & Props<{ item: Item }>;
