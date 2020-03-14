import React from "react";
import { PersistentDisplayList as List } from "../../custom";

const todoListKey = "todolist";

function App() {
  return (
    <List
      ui={{ addItem: true }}
      listItemUI={{ checkbox: true, deleteButton: true, editableText: true }}
      localStorageId={todoListKey}
    />
  );
}

export default App;
