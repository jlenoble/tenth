import React from "react";
import InputList, { todoListKey } from "./InputList";

function App() {
  return (
    <InputList
      defaultItems={JSON.parse(localStorage.getItem(todoListKey) || "[]")}
    />
  );
}

export default App;
