import React from "react";
import {
  ListCard as BaseListCard,
  withDnD,
  withCollection,
  withLocalStorage
} from "../list-card";

const todoListKey = "todolist";

const ListCard = withLocalStorage(withCollection(withDnD(BaseListCard)));

function App() {
  return <ListCard ui={{ inlineEdit: true }} localStorageId={todoListKey} />;
}

export default App;
