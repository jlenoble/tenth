import React from "react";
import { StatefulDnDList as List } from "../list";

// const todoListKey = "todolist";

function App() {
  return (
    <List
      defaultItems={[
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
