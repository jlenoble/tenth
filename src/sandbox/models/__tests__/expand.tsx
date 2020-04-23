import React from "react";
import { render } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { App, getExpandButtons, getCloseButtons } from "../__testHelpers__";

describe("TodoList", () => {
  it("Expand item", () => {
    const { getByRole, getAllByRole, getAllByText } = render(
      <App items={["foo", "bar", "baz"]} />
    );

    expect(Array.from(getAllByRole("list"))).toHaveLength(1);

    // "foo" is the current todo, so shows up also in the main header
    expect(Array.from(getAllByText("foo"))).toHaveLength(2);

    let buttons = getExpandButtons(getByRole("list") as HTMLUListElement);
    userEvents.click(buttons[0]);

    expect(Array.from(getAllByRole("list"))).toHaveLength(2);
    expect(Array.from(getAllByText("foo"))).toHaveLength(3);
  });

  it("Close item", () => {
    const { getByRole, getAllByRole, getAllByText } = render(
      <App items={["foo", "bar", "baz"]} />
    );

    expect(Array.from(getAllByRole("list"))).toHaveLength(1);
    expect(Array.from(getAllByText("bar"))).toHaveLength(1);

    let buttons = getExpandButtons(getByRole("list") as HTMLUListElement);
    userEvents.click(buttons[1]);

    expect(Array.from(getAllByRole("list"))).toHaveLength(2);
    expect(Array.from(getAllByText("bar"))).toHaveLength(2);

    buttons = getCloseButtons(document.body);
    expect(buttons).toHaveLength(1);
    userEvents.click(buttons[0]);

    expect(Array.from(getAllByRole("list"))).toHaveLength(1);
    expect(Array.from(getAllByText("bar"))).toHaveLength(1);
  });
});
