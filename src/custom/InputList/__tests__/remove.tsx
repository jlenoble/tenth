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

    expect(getByRole("list")).toBeEmpty();

    await userEvents.type(getByRole("textbox"), "foo");
    userEvents.click(getByText(/add/i));
    await userEvents.type(getByRole("textbox"), "bar");
    userEvents.click(getByText(/add/i));
    await userEvents.type(getByRole("textbox"), "quux");
    userEvents.click(getByText(/add/i));

    expect(getByRole("list")).toHaveTextContent("foobarquux");

    userEvents.click(getNthButton(getByRole("list"), 1, "Delete item"));

    expect(getByRole("list")).toHaveTextContent("barquux");

    userEvents.click(getNthButton(getByRole("list"), 2, "Delete item"));

    expect(getByRole("list")).toHaveTextContent("bar");

    userEvents.click(getNthButton(getByRole("list"), 1, "Delete item"));

    expect(getByRole("list")).toBeEmpty();
  });
});
