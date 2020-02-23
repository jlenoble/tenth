import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import useItems from "../../mui/list/hooks/useItems";
import InputList from "../../mui/list/InputList";

function App() {
  const itemHooks = useItems([]);
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
      <InputList defaultItems={items} dnd itemHooks={itemHooks} />
    </DragDropContext>
  );
}

export default App;
