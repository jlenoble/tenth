import React from "react";
import {
  ListCard as BaseListCard,
  withDnD,
  withItems,
  withLocalStorage
} from "../list-card";

const title = "TODO List";
const todoListKey = "todolist";

const ListCard = withLocalStorage(withItems(withDnD(BaseListCard)));

function App() {
  return <ListCard title={title} localStorageId={todoListKey} />;
}

export default App;
