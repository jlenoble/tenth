import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import InputList from "..";

describe("Items can be removed from InputList", () => {
  it("without any attributes", async () => {
    const { getByText, getByRole, getAllByRole } = render(<InputList />);
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

    const checkboxes = getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();

    userEvents.click(getAllByRole("checkbox")[0]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();

    userEvents.click(getAllByRole("checkbox")[2]);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();

    userEvents.click(getAllByRole("checkbox")[0]);

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
    expect(checkboxes).toHaveLength(3);
  });
});
