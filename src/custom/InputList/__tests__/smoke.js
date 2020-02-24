import React from "react";
import ReactDOM from "react-dom";
import InputList from "..";

describe("InputList renders without crashing", () => {
  it("without any attributes", () => {
    // Default list
    // Items can be added, removed, checked
    // They cannot be edited, persisted, reordered
    const div = document.createElement("div");
    ReactDOM.render(<InputList />, div);
  });
});
