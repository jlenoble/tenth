import React from "react";
import InputList, { Item } from "../../custom/InputList";

const todoListKey = "todolist";

const saveItems = (items: Item[]): void => {
  localStorage.setItem(todoListKey, JSON.stringify(items));
};

function App() {
  return (
    <InputList
      defaultItems={JSON.parse(localStorage.getItem(todoListKey) || "[]")}
      onSetItems={saveItems}
    />
  );
}

export default App;
