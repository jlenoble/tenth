import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import pick from "lodash/pick";
import Category from "./Category";
import data from "./data";
import "./List.css";

function App() {
  const { items, layout } = data;
  const [categories, setCategories] = useState(data.categories);

  return (
    <DragDropContext
      onDragEnd={({ draggableId, source, destination }: DropResult) => {
        if (!destination) {
          return;
        }

        if (
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) {
          return;
        }

        if (source.droppableId === destination.droppableId) {
          const newItemIds = categories[source.droppableId].concat();
          newItemIds.splice(source.index, 1);
          newItemIds.splice(destination.index, 0, draggableId);

          setCategories({
            ...categories,
            [source.droppableId]: newItemIds
          });
        } else {
          const sourceItemIds = categories[source.droppableId].concat();
          const destinationItemIds = categories[
            destination.droppableId
          ].concat();
          sourceItemIds.splice(source.index, 1);
          destinationItemIds.splice(destination.index, 0, draggableId);

          setCategories({
            ...categories,
            [source.droppableId]: sourceItemIds,
            [destination.droppableId]: destinationItemIds
          });
        }
      }}
    >
      {layout.map(key => {
        return (
          <Category
            className="tenth"
            key={key}
            categoryName={key}
            categoryElements={pick(items, categories[key])}
            dnd
          />
        );
      })}
    </DragDropContext>
  );
}

export default App;
