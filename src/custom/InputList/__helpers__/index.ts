import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import userEvents from "@testing-library/user-event";
import { expectTextContents, expectChecks } from "./expect";
import { fillWith } from "./type";

const getNthButton = (
  container: HTMLElement,
  nth: number,
  ariaLabel: string
) => {
  return container.querySelectorAll(`[aria-label="${ariaLabel}"]`)[nth];
};

export const render = (ui: ReactElement) => {
  const renderResult = rtlRender(ui);
  const { getByText, getByRole } = renderResult;
  const list = getByRole("list") as HTMLUListElement;
  const textbox = getByRole("textbox") as HTMLInputElement;
  const addButton = getByText(/add/i) as HTMLButtonElement;

  const checkNthChild = (nth: number) =>
    userEvents.click(renderResult.getAllByRole("checkbox")[nth]);

  return {
    list,
    textbox,
    addButton,

    fillWith: (items: string[]) => fillWith(textbox, addButton, items),

    checkNthChild,
    checkChildren: (indices: number[]) => indices.forEach(checkNthChild),

    removeNthChild: (nth: number) =>
      userEvents.click(getNthButton(list, nth, "Delete item")),

    expectTextContents: (items: string[]) => expectTextContents(list, items),
    expectChecks: (items: boolean[]) => expectChecks(list, items),

    ...renderResult
  };
};

export * from "./create";
export * from "./dnd";
export * from "./localstorage";
export * from "./mock";
