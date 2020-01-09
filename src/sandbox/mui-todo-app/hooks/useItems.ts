import { useState } from "react";

export type Item = {
  id: string;
  text: string;
  checked: boolean;
};

function useItems(initialValue: Item[] = []) {
  const [items, setItems] = useState(initialValue);

  return {
    items,

    addItem: (text: string, id: string) => {
      if (text !== "") {
        setItems(
          items.concat({
            id,
            text,
            checked: false
          })
        );
      }
    },

    checkItem: (id: string) => {
      setItems(
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
      setItems(items.filter(item => id !== item.id));
    }
  };
}

export default useItems;
