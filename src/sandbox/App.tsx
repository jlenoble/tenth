import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import pick from "lodash/pick";
import Category from "./Category";
import data from "./data";
import "./List.css";

function App() {
  const { items, layout } = data;
  const [categories, setData] = useState(data.categories);

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

        const category = categories[source.droppableId];
        const newItemIds = category.concat();
        newItemIds.splice(source.index, 1);
        newItemIds.splice(destination.index, 0, draggableId);

        setData({
          ...categories,
          [source.droppableId]: newItemIds
        });
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
