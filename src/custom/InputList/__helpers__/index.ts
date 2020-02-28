import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import userEvents from "@testing-library/user-event";
import { expectTextContents, expectChecks } from "./expect";

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

const isNotEmpty = (list: HTMLUListElement) =>
  Boolean(list.querySelector("li"));

export const render = (ui: ReactElement) => {
  const renderResult = rtlRender(ui);
  const { getByText, getByRole } = renderResult;
  const list = getByRole("list") as HTMLUListElement;
  const textbox = getByRole("textbox") as HTMLInputElement;
  const addButton = getByText(/add/i) as HTMLButtonElement;

  const checkNthChild = (nth: number) =>
    userEvents.click(renderResult.getAllByRole("checkbox")[nth]);
  const removeNthChild = (nth: number) => {
    userEvents.click(getNthButton(list, nth, "Delete item"));
  };

  const removeChildren = (indices: number[]) =>
    indices
      .sort()
      .reverse()
      .forEach(removeNthChild);
  const clear = () => {
    if (isNotEmpty(list)) {
      const checkboxes = renderResult.getAllByRole("checkbox");
      removeChildren(checkboxes.map((_, i) => i));
    }
  };

  return {
    list,
    textbox,
    addButton,

    add: (items: string[]) => add(textbox, addButton, items),
    clear,
    fillWith: async (items: string[]) => {
      clear();
      await add(textbox, addButton, items);
    },

    checkNthChild,
    checkChildren: (indices: number[]) => indices.forEach(checkNthChild),

    removeNthChild,
    removeChildren,

    expectTextContents: (items: string[]) => expectTextContents(list, items),
    expectChecks: (items: boolean[]) => expectChecks(list, items),

    ...renderResult
  };
};

export * from "./create";
export * from "./dnd";
export * from "./localstorage";
export * from "./mock";
