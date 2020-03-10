import { useState } from "react";
import { Item, ItemHooks } from "./item";

type Callback = NonNullable<ItemHooks["setItems"]>;

export type OnSetItems =
  | {
      onBeforeSetItems?: Callback;
      onSetItems: Callback;
    }
  | {
      onBeforeSetItems: Callback;
      onSetItems?: Callback;
    }
  | Callback;

export const wrapSetItems = (
  setItems: OnSetItems,
  onSetItems?: OnSetItems
): Callback => {
  const fns: Callback[] = [];

  if (typeof setItems === "object") {
    if (setItems.onBeforeSetItems) {
      fns.push(setItems.onBeforeSetItems);
    }
    if (setItems.onSetItems) {
      fns.push(setItems.onSetItems);
    }
  } else {
    fns.push(setItems);
  }

  if (typeof onSetItems === "object") {
    if (onSetItems.onBeforeSetItems) {
      fns.unshift(onSetItems.onBeforeSetItems);
    }
    if (onSetItems.onSetItems) {
      fns.push(onSetItems.onSetItems);
    }
  } else if (onSetItems) {
    fns.push(onSetItems);
  }

  switch (fns.length) {
    case 2:
      return (items: Item[]) => {
        fns[0](items);
        fns[1](items);
      };

    case 3:
      return (items: Item[]) => {
        fns[0](items);
        fns[1](items);
        fns[2](items);
      };

    case 1:
      return fns[0];

    case 4:
      return (items: Item[]) => {
        fns[0](items);
        fns[1](items);
        fns[2](items);
        fns[3](items);
      };

    default:
      // Should never happen because of setItems type but this satisfies Typescript
      return () => {};
  }
};

export const useItems = (
  initialValue: Item[] = [],
  onSetItems?: OnSetItems
): ItemHooks => {
  const [items, setItems] = useState(initialValue);
  const wrappedSetItems = wrapSetItems(setItems, onSetItems);

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
