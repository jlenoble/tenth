import React from "react";
import ReactDOM from "react-dom";
import InputList from "..";

const todoListKey = "todolist";

const saveItems = items => {
  localStorage.setItem(todoListKey, JSON.stringify(items));
};

describe("InputList renders without crashing", () => {
  it("without any attributes", () => {
    // Items can be added, removed, checked
    // They cannot be edited, persisted, reordered
    const div = document.createElement("div");
    ReactDOM.render(<InputList />, div);
  });

  it("with persistence", () => {
    // Items can be added, removed, checked, persisted
    // They cannot be edited, reordered
    const div = document.createElement("div");
    ReactDOM.render(
      <InputList
        defaultItems={JSON.parse(localStorage.getItem(todoListKey) || "[]")}
        onSetItems={saveItems}
      />,
      div
    );
  });
});
