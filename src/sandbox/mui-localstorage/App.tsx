import React from "react";
import InputList from "./InputList";
import { todoListKey } from "./hooks/useItems";

function App() {
  return (
    <InputList
      defaultItems={JSON.parse(localStorage.getItem(todoListKey) || "[]")}
    />
  );
}

export default App;
