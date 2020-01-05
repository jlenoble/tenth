import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import pick from "lodash/pick";
import Category from "./Category";
import data from "./data";
import "./List.css";

function App() {
  return (
    <DragDropContext
      onDragEnd={() => {
        console.log("END");
      }}
    >
      {Object.entries(data.sets).map(([key, itemIds]) => {
        return (
          <Category
            className="tenth"
            key={key}
            categoryName={key}
            categoryElements={pick(data.items, itemIds)}
            dnd
          />
        );
      })}
    </DragDropContext>
  );
}

export default App;
