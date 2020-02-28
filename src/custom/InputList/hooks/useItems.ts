import { useState } from "react";

export type Item = {
  id: string;
  text: string;
  checked: boolean;
};

function useItems(
  initialValue: Item[] = [],
  callback?: (items: Item[]) => void
) {
  const [items, setItems] = useState(initialValue);

  const setItemsAndCallBack = callback
    ? (items: Item[]): void => {
        setItems(items);
        callback(items);
      }
    : setItems;

  return {
    items,
    setItems: setItemsAndCallBack,

    addItem: (item: { id: string; text: string }) => {
      if (item.text !== "" && items.findIndex(it => item.id === it.id) === -1) {
        setItemsAndCallBack(
          items.concat({
            ...item,
            checked: false
          })
        );
      }
    },

    checkItem: (id: string) => {
      setItemsAndCallBack(
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
      setItemsAndCallBack(items.filter(item => id !== item.id));
    }
  };
}

export default useItems;
