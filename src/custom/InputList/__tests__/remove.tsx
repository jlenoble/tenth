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
    const { list, textbox, addButton } = render(<InputList />);

    expect(list).toBeEmpty();

    await userEvents.type(textbox, "foo");
    userEvents.click(addButton);
    await userEvents.type(textbox, "bar");
    userEvents.click(addButton);
    await userEvents.type(textbox, "quux");
    userEvents.click(addButton);

    expect(list).toHaveTextContent("foobarquux");

    userEvents.click(getNthButton(list, 1, "Delete item"));

    expect(list).toHaveTextContent("barquux");

    userEvents.click(getNthButton(list, 2, "Delete item"));

    expect(list).toHaveTextContent("bar");

    userEvents.click(getNthButton(list, 1, "Delete item"));

    expect(list).toBeEmpty();
  });
});
