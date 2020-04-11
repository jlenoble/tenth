import React from "react";
import { StatefulDnDList, withLocalStorage } from "../list";

const List = withLocalStorage(StatefulDnDList);
const todoListKey = "todolist";

function App() {
  return <List localStorageId={todoListKey} />;
}

export default App;
