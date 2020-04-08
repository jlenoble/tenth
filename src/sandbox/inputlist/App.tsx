import React from "react";
import { ListCard } from "../card";

const todoListKey = "todolist";

function App() {
  return (
    <ListCard
      ui={{
        addItem: true,
        checkbox: true,
        deleteButton: true,
        editableText: true
      }}
      localStorageId={todoListKey}
    />
  );
}

export default App;
