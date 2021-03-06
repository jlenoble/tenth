import React from "react";
import { render, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { tmpId } from "../todo";
import { appFactory, getMenuButton } from "../__testHelpers__";

const App = appFactory((item, i) => ({
  id: tmpId(),
  title: i ? item : "",
  completed: !(i % 2),
}));

describe("Visibility filters", () => {
  it("SHOW_ACTIVE", async () => {
    const { container, getByRole } = render(
      <App items={["foo", "bar", "baz", "qux", "quux", "foobar"]} />
    );

    const menu = getMenuButton(container) as HTMLButtonElement;
    userEvents.click(menu);

    const menuItem = within(document.body).getByText("Show active");
    userEvents.click(menuItem);

    const list = getByRole("list") as HTMLUListElement;
    const listitems = within(list).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "bar",
      "qux",
      "foobar",
    ]);
  });

  it("SHOW_COMPLETED", async () => {
    const { container, getByRole } = render(
      <App items={["foo", "bar", "baz", "qux", "quux", "foobar"]} />
    );

    const menu = getMenuButton(container) as HTMLButtonElement;
    userEvents.click(menu);

    const menuItem = within(document.body).getByText("Show completed");
    userEvents.click(menuItem);

    const list = getByRole("list") as HTMLUListElement;
    const listitems = within(list).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual(["", "baz", "quux"]);
  });

  it("SHOW_INVALID", async () => {
    const { container, getByRole } = render(
      <App items={["foo", "bar", "baz", "qux", "quux", "foobar"]} />
    );

    const menu = getMenuButton(container) as HTMLButtonElement;
    userEvents.click(menu);

    const menuItem = within(document.body).getByText("Show invalid");
    userEvents.click(menuItem);

    const list = getByRole("list") as HTMLUListElement;
    const listitems = within(list).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([""]);
  });

  it("SHOW_ALL", async () => {
    const { container, getByRole } = render(
      <App items={["foo", "bar", "baz", "qux", "quux", "foobar"]} />
    );

    const menu = getMenuButton(container) as HTMLButtonElement;
    userEvents.click(menu);
    userEvents.click(within(document.body).getByText("Show active"));
    userEvents.click(menu);
    userEvents.click(within(document.body).getByText("Show all"));

    const list = getByRole("list") as HTMLUListElement;
    const listitems = within(list).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "",
      "bar",
      "baz",
      "qux",
      "quux",
      "foobar",
    ]);
  });
});
