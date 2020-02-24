import React from "react";
import ReactDOM from "react-dom";
import { DragDropContext } from "react-beautiful-dnd";
import InputList, { useItems } from "..";

const todoListKey = "todolist";

const saveItems = items => {
  localStorage.setItem(todoListKey, JSON.stringify(items));
};

const onDragEnd = ({ items, setItems }) => ({ source, destination }) => {
  if (!destination) {
    return;
  }

  if (destination.droppableId === source.droppableId) {
    if (destination.index === source.index) {
      return;
    }

    const newItems = items.concat();
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, items[source.index]);

    setItems(newItems);
  }
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

    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
  });
});
