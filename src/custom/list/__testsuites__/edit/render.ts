import { ReactElement } from "react";
import { render as rtlRender } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { expectTextContents } from "../add/expect";

export const render = (ui: ReactElement) => {
  const renderResult = rtlRender(ui);
  const { getByRole } = renderResult;
  const list = getByRole("list") as HTMLUListElement;

  const getNth = (nth: number) => {
    return Array.from(list.querySelectorAll("li"))[nth];
  };

  const getNthListItemText = (nth: number) => {
    return getNth(nth)?.querySelector(".MuiListItemText-root");
  };

  const getNthListItemTextField = (nth: number) => {
    return getNth(nth)?.querySelector(".MuiInput-input");
  };

  const editNthChild = async (nth: number, text: string) => {
    const textItem = getNthListItemText(nth);

    if (textItem) {
      userEvents.click(textItem);
      const textField = getNthListItemTextField(nth);

      if (textField) {
        await userEvents.type(textField, text);

        fireEvent.keyPress(textField, {
          key: "Enter",
          code: 13,
          charCode: 13,
          keyCode: 13
        });
      } else {
        throw new Error(`Missing ${nth}th ListItemTextField`);
      }
    } else {
      throw new Error(`Missing ${nth}th ListItemText`);
    }
  };

  return {
    editNthChild,

    expectTextContents: (items: string[]) => expectTextContents(list, items),

    ...renderResult
  };
};
