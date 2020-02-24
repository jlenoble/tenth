import React from "react";
import { render } from "@testing-library/react";
import { DragDropContext } from "react-beautiful-dnd";
import InputList, { useItems } from "..";
import { listId, saveItems, onDragEnd } from "../__helpers__";

describe("InputList renders without crashing", () => {
  it("without any attributes", () => {
    // Items can be added, removed, checked
    // They cannot be edited, persisted, reordered
    render(<InputList />);
  });

  it("with persistence", () => {
    // Items can be added, removed, checked, persisted
    // They cannot be edited, reordered
    render(
      <InputList
        defaultItems={JSON.parse(localStorage.getItem(listId) || "[]")}
        onSetItems={saveItems(listId)}
      />
    );
  });

  it("with DnD", () => {
    // Items can be added, removed, checked, reordered
    // They cannot be edited, persisted
    function App() {
      const itemHooks = useItems([]);

      return (
        <DragDropContext onDragEnd={onDragEnd(itemHooks)}>
          <InputList dnd itemHooks={itemHooks} />
        </DragDropContext>
      );
    }

    render(<App />);
  });

  it("with DnD and persistence", () => {
    // Items can be added, removed, checked, reordered, persisted
    // They cannot be edited
    function App() {
      const itemHooks = useItems(
        JSON.parse(localStorage.getItem(listId) || "[]"),
        saveItems(listId)
      );

      return (
        <DragDropContext onDragEnd={onDragEnd(itemHooks)}>
          <InputList dnd itemHooks={itemHooks} />
        </DragDropContext>
      );
    }

    render(<App />);
  });
});
