import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import userEvents from "@testing-library/user-event";
import { expectTextContents, expectChecks } from "./expect";
import { fillWith } from "./type";

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

    fillWith: (items: string[]) => fillWith(textbox, addButton, items),
    checkNthChild: (nth: number) =>
      userEvents.click(renderResult.getAllByRole("checkbox")[nth]),

    expectTextContents: (items: string[]) => expectTextContents(list, items),
    expectChecks: (items: boolean[]) => expectChecks(list, items),

    ...renderResult
  };
};

export * from "./dnd";
export * from "./localstorage";
export * from "./mock";
