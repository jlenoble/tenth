import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import InputList, { useItems } from "../../custom/InputList";
import {
  onDragEnd,
  todoListKey,
  saveItems
} from "../../custom/InputList/__helpers__";

function App() {
  const itemHooks = useItems(
    JSON.parse(localStorage.getItem(todoListKey) || "[]"),
    saveItems(todoListKey)
  );

  return (
    <DragDropContext onDragEnd={onDragEnd(itemHooks)}>
      <InputList dnd itemHooks={itemHooks} />
    </DragDropContext>
  );
}

export default App;
