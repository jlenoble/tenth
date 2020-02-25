import { DropResult } from "react-beautiful-dnd";
import { render as rtlRender } from "@testing-library/react";
import { useItems, Item } from "..";
import { ReactElement } from "react";

export const listId = "todolist";

export const render = (ui: ReactElement) => {
  const renderResult = rtlRender(ui);
  const { getByText, getByRole } = renderResult;
  const list = getByRole("list");
  const textbox = getByRole("textbox");
  const addButton = getByText(/add/i);

  return {
    list,
    textbox,
    addButton,
    ...renderResult
  };
};

export const saveItems = (listId: string) => (items: Item[]) => {
  localStorage.setItem(listId, JSON.stringify(items));
};

export const onDragEnd = ({
  items,
  setItems
}: ReturnType<typeof useItems>) => ({ source, destination }: DropResult) => {
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
