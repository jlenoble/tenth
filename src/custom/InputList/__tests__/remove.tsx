import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import InputList from "..";

const getNthButton = (
  container: HTMLElement,
  nth: number,
  ariaLabel: string
) => {
  return container.querySelectorAll(`[aria-label="${ariaLabel}"]`)[nth - 1];
};

describe("Items can be removed from InputList", () => {
  it("without any attributes", async () => {
    const { getByText, getByRole } = render(<InputList />);
    const list = getByRole("list");
    const textbox = getByRole("textbox");
    const addButton = getByText(/add/i);

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
