import React from "react";
import {
  List as BaseList,
  withDnD,
  withItems,
  withLocalStorage
} from "../list";

const List = withLocalStorage(withItems(withDnD(BaseList)));
const todoListKey = "todolist";

function App() {
  return <List localStorageId={todoListKey} />;
}

export default App;
