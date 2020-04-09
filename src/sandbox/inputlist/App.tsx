import React from "react";
import { List } from "../list";

// const todoListKey = "todolist";

function App() {
  return (
    <List
      items={[
        { id: "c1", primary: "bobo" },
        { id: "c2", primary: "toto" }
      ]}
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
