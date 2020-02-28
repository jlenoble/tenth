import { render as rtlRender } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { ReactElement } from "react";
import { haveTextContents, haveChecks } from "./expect";

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
    haveTextContents: (items: string[]) => haveTextContents(list, items),
    haveChecks: (items: boolean[]) => haveChecks(list, items),
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

export * from "./dnd";
export * from "./localstorage";
export * from "./mock";
