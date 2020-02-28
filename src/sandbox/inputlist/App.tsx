import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import InputList, { Item, useItems } from "../../custom/InputList";
import { onDragEnd } from "../../custom/InputList/__helpers__";

const todoListKey = "todolist";

const saveItems = (items: Item[]): void => {
  localStorage.setItem(todoListKey, JSON.stringify(items));
};

function App() {
  const itemHooks = useItems(
    JSON.parse(localStorage.getItem(todoListKey) || "[]"),
    saveItems
  );

  return (
    <DragDropContext onDragEnd={onDragEnd(itemHooks)}>
      <InputList dnd itemHooks={itemHooks} />
    </DragDropContext>
  );
}

export default App;
