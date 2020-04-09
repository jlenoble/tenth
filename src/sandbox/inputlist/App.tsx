import React from "react";
import { List } from "../list";

// const todoListKey = "todolist";

function App() {
  return (
    <List
      items={["toto", "baba"]}
      // ui={{
      //   addItem: true,
      //   checkbox: true,
      //   deleteButton: true,
      //   editableText: true
      // }}
      // localStorageId={todoListKey}
    />
  );
}

export default App;
