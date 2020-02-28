import { render as rtlRender } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { ReactElement } from "react";

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

export const haveChecks = (list: HTMLUListElement, items: boolean[]) => {
  const checks = (Array.from(
    list.querySelectorAll('input[type="checkbox"]')
  ) as HTMLInputElement[]).map(input => input.checked);
  expect(checks).toEqual(items);
};

export * from "./dnd";
export * from "./localstorage";
export * from "./mock";
