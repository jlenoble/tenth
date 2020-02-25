import React from "react";
import userEvents from "@testing-library/user-event";
import InputList from "..";
import { render } from "../__helpers__";

describe("Items can be checked in InputList", () => {
  it("without any attributes", async () => {
    const { list, textbox, addButton, getAllByRole } = render(<InputList />);

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
