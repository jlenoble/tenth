import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import InputList from "..";

describe("Items can be added to InputList", () => {
  it("without any attributes", async () => {
    const { getByText, getByRole } = render(<InputList />);
    const list = getByRole("list");
    const textbox = getByRole("textbox");
    const addButton = getByText(/add/i);

    expect(textbox).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(list).toBeEmpty();

    await userEvents.type(textbox, "foo");
    expect(list).toBeEmpty();

    userEvents.click(addButton);
    expect(list).toHaveTextContent("foo");

    await userEvents.type(textbox, "bar");
    expect(list).toHaveTextContent("foo");

    fireEvent.keyPress(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });
    expect(list).toHaveTextContent("foobar");
  });
});
