import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import useItems, { Item } from "../../mui/list/hooks/useItems";
import InputList from "../../mui/list/InputList";

const todoListKey = "todolist";

const saveItems = (items: Item[]): void => {
  localStorage.setItem(todoListKey, JSON.stringify(items));
};

function App() {
  const itemHooks = useItems(
    JSON.parse(localStorage.getItem(todoListKey) || "[]"),
    saveItems
  );

  const { items, setItems } = itemHooks;

  return (
    <DragDropContext
      onDragEnd={({ source, destination }: DropResult) => {
        if (!destination) {
          return;
        }

        if (destination.droppableId === source.droppableId) {
          if (destination.index === source.index) {
            return;
          }

          const newItems = items.concat();
          newItems.splice(source.index, 1);
          newItems.splice(destination.index, 0, items[source.index]);

          setItems(newItems);
        }
      }}
    >
      <InputList dnd listId={todoListKey} itemHooks={itemHooks} />
    </DragDropContext>
  );
}

export default App;
