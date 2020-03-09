import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import userEvents from "@testing-library/user-event";
import { expectTextContents } from "../add/expect";

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

const getNthButton = (
  container: HTMLElement,
  nth: number,
  ariaLabel: string
) => {
  return container.querySelectorAll(`[aria-label="${ariaLabel}"]`)[nth];
};

export const render = (ui: ReactElement) => {
  const renderResult = rtlRender(ui);
  const { getByRole } = renderResult;
  const list = getByRole("list") as HTMLUListElement;

  const removeNthChild = (nth: number) => {
    userEvents.click(getNthButton(list, nth, "Delete item"));
  };

  const removeChildren = (indices: number[]) =>
    indices
      .sort()
      .reverse()
      .forEach(removeNthChild);

  return {
    list,

    removeNthChild,
    removeChildren,

    expectTextContents: (items: string[]) => expectTextContents(list, items),

    ...renderResult
  };
};
