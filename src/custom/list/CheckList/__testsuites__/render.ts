import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import userEvents from "@testing-library/user-event";
import { expectChecks } from "./expect";

export const render = (ui: ReactElement) => {
  const renderResult = rtlRender(ui);
  const { getByRole, getAllByRole } = renderResult;
  const list = getByRole("list") as HTMLUListElement;

  const checkNthChild = (nth: number) =>
    userEvents.click(getAllByRole("checkbox")[nth]);

  return {
    checkNthChild,
    checkChildren: (indices: number[]) => indices.forEach(checkNthChild),

    expectChecks: (items: boolean[]) => expectChecks(list, items),

    ...renderResult
  };
};
