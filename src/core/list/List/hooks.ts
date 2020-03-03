import { useState } from "react";
import { Item, ItemHooks } from "./item";

type Callback = ItemHooks["setItems"];

export type OnSetItems =
  | {
      onBeforeSetItems?: Callback;
      onSetItems?: Callback;
    }
  | Callback;

export const useItems = (
  initialValue: Item[] = [],
  onSetItems?: OnSetItems
): ItemHooks => {
  const [items, setItems] = useState(initialValue);
  let wrappedSetItems: Callback;
  let onBeforeSetItems: Callback | undefined;

  if (typeof onSetItems === "object") {
    onBeforeSetItems = onSetItems.onBeforeSetItems;
    onSetItems = onSetItems.onSetItems;
  }

  wrappedSetItems = onBeforeSetItems
    ? onSetItems
      ? (items: Item[]): void => {
          onBeforeSetItems!(items);
          setItems(items);
          (onSetItems as Callback)(items);
        }
      : (items: Item[]): void => {
          onBeforeSetItems!(items);
          setItems(items);
        }
    : onSetItems
    ? (items: Item[]): void => {
        setItems(items);
        (onSetItems as Callback)(items);
      }
    : setItems;

  return {
    items,
    setItems: wrappedSetItems,

    addItem: (item: Item) => {
      if (item.text !== "" && items.findIndex(it => item.id === it.id) === -1) {
        wrappedSetItems(items.concat(item));
      }
    },

    checkItem: (id: string) => {
      wrappedSetItems(
        items.map(item => {
          if (id === item.id) {
            return {
              ...item,
              checked: !item.checked
            };
          }

          return item;
        })
      );
    },

    removeItem: (id: string) => {
      wrappedSetItems(items.filter(item => id !== item.id));
    },

    clearItems: () => {
      wrappedSetItems([]);
    }
  };
};
