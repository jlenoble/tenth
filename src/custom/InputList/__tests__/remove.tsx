import React from "react";
import userEvents from "@testing-library/user-event";
import InputList from "..";
import { render } from "../__helpers__";

const getNthButton = (
  container: HTMLElement,
  nth: number,
  ariaLabel: string
) => {
  return container.querySelectorAll(`[aria-label="${ariaLabel}"]`)[nth - 1];
};

describe("Items can be removed from InputList", () => {
  it("without any attributes", async () => {
    const { list, fillWith, expectTextContents } = render(<InputList />);
    expect(list).toBeEmpty();

    await fillWith(["foo", "bar", "quux"]);
    expectTextContents(["foo", "bar", "quux"]);

    userEvents.click(getNthButton(list, 1, "Delete item"));
    expectTextContents(["bar", "quux"]);

    userEvents.click(getNthButton(list, 2, "Delete item"));
    expectTextContents(["bar"]);

    userEvents.click(getNthButton(list, 1, "Delete item"));
    expect(list).toBeEmpty();
  });
});
