import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import userEvents from "@testing-library/user-event";
import { expectTextContents } from "./expect";

const add = async (
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

export const render = (ui: ReactElement) => {
  const renderResult = rtlRender(ui);
  const { getByText, getByRole } = renderResult;
  const list = getByRole("list") as HTMLUListElement;
  const textbox = getByRole("textbox") as HTMLInputElement;
  const addButton = getByText(/add/i) as HTMLButtonElement;

  return {
    textbox,
    addButton,

    add: (items: string[]) => add(textbox, addButton, items),
    expectTextContents: (items: string[]) => expectTextContents(list, items),

    ...renderResult
  };
};
