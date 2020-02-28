import { DropResult } from "react-beautiful-dnd";
import {
  render as rtlRender,
  RenderResult as RtlRenderResult
} from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { useItems, Item } from "..";
import { ReactElement } from "react";

export const listId = "todolist";

export const render = (ui: ReactElement) => {
  const renderResult = rtlRender(ui);
  const { getByText, getByRole } = renderResult;
  const list = getByRole("list") as HTMLUListElement;
  const textbox = getByRole("textbox") as HTMLInputElement;
  const addButton = getByText(/add/i) as HTMLButtonElement;

  return {
    list,
    textbox,
    addButton,
    ...renderResult
  };
};

export const fillWith = async (
  textbox: HTMLInputElement,
  addButton: HTMLButtonElement,
  items: string[]
) => {
  const l = items.length;

  for (let i = 0; i < l; i++) {
    await userEvents.type(textbox, items[i]);
    userEvents.click(addButton);
  }
};

export const haveTextContents = (list: HTMLUListElement, items: string[]) => {
  const texts = Array.from(list.querySelectorAll("li")).map(
    li => li.textContent
  );
  expect(texts).toEqual(items);
};

export const haveChecks = (
  checkboxes: HTMLInputElement[],
  items: boolean[]
) => {
  expect(checkboxes.map(input => input.checked)).toEqual(items);
};

export const saveItems = (listId: string) => (items: Item[]) => {
  localStorage.setItem(listId, JSON.stringify(items));
};

export * from "./dnd";
export * from "./mock";
