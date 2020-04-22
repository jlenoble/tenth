import React from "react";
import { render, fireEvent, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { List } from "../__testHelpers__";

describe("TodoList", () => {
  it("Show error", () => {
    const { getByRole } = render(<List items={["foo", "", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];
    let listitem = listitems[1];
    const { getByRole: subGetByRole } = within(listitem);

    const alert = subGetByRole("alert") as HTMLDivElement;
    expect(alert.textContent).toEqual("");
  });

  it("Correct error", async () => {
    const { getByRole } = render(<List items={["foo", "", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];
    let listitem = listitems[1];
    const { getByRole: subGetByRole } = within(listitem);

    const alert = subGetByRole("alert") as HTMLDivElement;

    userEvents.click(alert);
    expect(alert).not.toBeInTheDocument();

    const textbox = subGetByRole("textbox") as HTMLInputElement;
    await userEvents.type(textbox, "bar");

    fireEvent.keyDown(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });

    expect(textbox).not.toBeInTheDocument();
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
  });
});
