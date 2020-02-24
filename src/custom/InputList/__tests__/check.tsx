import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import InputList from "..";

describe("Items can be removed from InputList", () => {
  it("without any attributes", async () => {
    const { getByText, getByRole, getAllByRole } = render(<InputList />);

    expect(getByRole("list")).toBeEmpty();

    await userEvents.type(getByRole("textbox"), "foo");
    userEvents.click(getByText(/add/i));
    await userEvents.type(getByRole("textbox"), "bar");
    userEvents.click(getByText(/add/i));
    await userEvents.type(getByRole("textbox"), "quux");
    userEvents.click(getByText(/add/i));

    expect(getAllByRole("checkbox")).toHaveLength(3);
    expect(getAllByRole("checkbox")[0]).not.toBeChecked();
    expect(getAllByRole("checkbox")[1]).not.toBeChecked();
    expect(getAllByRole("checkbox")[2]).not.toBeChecked();

    userEvents.click(getAllByRole("checkbox")[0]);

    expect(getAllByRole("checkbox")[0]).toBeChecked();
    expect(getAllByRole("checkbox")[1]).not.toBeChecked();
    expect(getAllByRole("checkbox")[2]).not.toBeChecked();

    userEvents.click(getAllByRole("checkbox")[2]);

    expect(getAllByRole("checkbox")[0]).toBeChecked();
    expect(getAllByRole("checkbox")[1]).not.toBeChecked();
    expect(getAllByRole("checkbox")[2]).toBeChecked();

    userEvents.click(getAllByRole("checkbox")[0]);

    expect(getAllByRole("checkbox")[0]).not.toBeChecked();
    expect(getAllByRole("checkbox")[1]).not.toBeChecked();
    expect(getAllByRole("checkbox")[2]).toBeChecked();
    expect(getAllByRole("checkbox")).toHaveLength(3);
  });
});
