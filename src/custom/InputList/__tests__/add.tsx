import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import InputList from "..";

describe("Items can be added to InputList", () => {
  it("without any attributes", async () => {
    const { getByText, getByRole } = render(<InputList />);

    expect(getByRole("textbox")).toBeInTheDocument();
    expect(getByText(/add/i)).toBeInTheDocument();
    expect(getByRole("list")).toBeEmpty();

    await userEvents.type(getByRole("textbox"), "foo");
    expect(getByRole("list")).toBeEmpty();

    userEvents.click(getByText(/add/i));
    expect(getByRole("list")).toHaveTextContent("foo");

    await userEvents.type(getByRole("textbox"), "bar");
    expect(getByRole("list")).toHaveTextContent("foo");

    fireEvent.keyPress(getByRole("textbox"), {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });
    expect(getByRole("list")).toHaveTextContent("foobar");
  });
});
