import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import { dragAndDrop } from "./dnd";

export const render = (ui: ReactElement) => {
  const renderResult = rtlRender(ui);
  const { getByRole, getAllByRole, getByText } = renderResult;
  const list = getByRole("list") as HTMLUListElement;
  const getItems = () => getAllByRole("listitem");

  return {
    list,

    dnd: (start: number, end: number) =>
      dragAndDrop(start, end, { getItems, getByText }),

    ...renderResult
  };
};
