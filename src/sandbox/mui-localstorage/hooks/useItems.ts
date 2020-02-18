import { useState } from "react";

export type Item = {
  id: string;
  text: string;
  checked: boolean;
};

export const todoListKey = "todolist";

function useItems(initialValue: Item[] = []) {
  const [items, setItems] = useState(initialValue);

  const setItemsAndSave = (items: Item[]): void => {
    setItems(items);
    localStorage.setItem(todoListKey, JSON.stringify(items));
  };

  return {
    items,

    addItem: (text: string, id: string) => {
      if (text !== "") {
        setItemsAndSave(
          items.concat({
            id,
            text,
            checked: false
          })
        );
      }
    },

    checkItem: (id: string) => {
      setItemsAndSave(
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
      setItemsAndSave(items.filter(item => id !== item.id));
    }
  };
}

export default useItems;
