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

    addItem: (text: string, id: string) => {
      if (text !== "") {
        setItemsAndCallBack(
          items.concat({
            id,
            text,
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
              id,
              text: item.text,
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
