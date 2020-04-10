import React from "react";
import { StatefulDnDList, withLocalStorage } from "../list";

const List = withLocalStorage(StatefulDnDList);
const todoListKey = "todolist";

function App() {
  return (
    <List
      // ui={{
      //   addItem: true,
      //   checkbox: true,
      //   deleteButton: true,
      //   editableText: true
      // }}
      localStorageId={todoListKey}
    />
  );
}

export default App;
