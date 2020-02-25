import React from "react";
import userEvents from "@testing-library/user-event";
import InputList from "..";
import { render, fillWith, haveChecks } from "../__helpers__";

describe("Items can be checked in InputList", () => {
  it("without any attributes", async () => {
    const { list, textbox, addButton, getAllByRole } = render(<InputList />);
    expect(list).toBeEmpty();

    await fillWith(textbox, addButton, ["foo", "bar", "quux"]);
    const checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    haveChecks(checkboxes, [false, false, false]);

    userEvents.click(getAllByRole("checkbox")[0]);
    haveChecks(checkboxes, [true, false, false]);

    userEvents.click(getAllByRole("checkbox")[2]);
    haveChecks(checkboxes, [true, false, true]);

    userEvents.click(getAllByRole("checkbox")[0]);
    haveChecks(checkboxes, [false, false, true]);
  });
});
