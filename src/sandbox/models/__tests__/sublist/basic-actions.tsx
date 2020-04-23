import React from "react";
import { render, fireEvent, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { App, getDeleteButtons, getExpandButtons } from "../../__testHelpers__";

describe("Todo sublist", () => {
  it("Add", async () => {
    const { getByRole, getAllByRole, getAllByText } = render(
      <App items={["foo", "bar", "baz"]} />
    );

    const expandButtons = getExpandButtons(
      getByRole("list") as HTMLUListElement
    );
    userEvents.click(expandButtons[2]);

    const sublist = Array.from(getAllByRole("list"))[1] as HTMLUListElement;

    const textbox = Array.from(getAllByRole("textbox"))[1] as HTMLInputElement;
    const addButton = Array.from(getAllByText(/add/i))[1] as HTMLButtonElement;

    await userEvents.type(textbox, "foobar");
    userEvents.click(addButton);

    let listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foobar"]);

    await userEvents.type(textbox, "quux");

    listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foobar"]);

    fireEvent.keyPress(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });

    listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foobar", "quux"]);
  });

  it("Remove", async () => {
    const { getByRole, getAllByRole, getAllByText } = render(
      <App items={["foo", "bar", "baz"]} />
    );

    const expandButtons = getExpandButtons(
      getByRole("list") as HTMLUListElement
    );
    userEvents.click(expandButtons[2]);

    const sublist = Array.from(getAllByRole("list"))[1] as HTMLUListElement;

    const textbox = Array.from(getAllByRole("textbox"))[1] as HTMLInputElement;
    const addButton = Array.from(getAllByText(/add/i))[1] as HTMLButtonElement;

    await userEvents.type(textbox, "foobar");
    userEvents.click(addButton);
    await userEvents.type(textbox, "quux");
    userEvents.click(addButton);

    let listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foobar", "quux"]);

    let buttons = getDeleteButtons(sublist);
    userEvents.click(buttons[0]);

    listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["quux"]);

    buttons = getDeleteButtons(sublist);
    userEvents.click(buttons[0]);

    try {
      within(sublist).getAllByRole("listitem");
    } catch (e) {
      expect(e.message).toContain(
        `Unable to find an accessible element with the role "listitem"`
      );
    }
  });

  it("Check", async () => {
    const { getByRole, getAllByRole, getAllByText } = render(
      <App items={["foo", "bar", "baz"]} />
    );

    const expandButtons = getExpandButtons(
      getByRole("list") as HTMLUListElement
    );
    userEvents.click(expandButtons[2]);

    const sublist = Array.from(getAllByRole("list"))[1] as HTMLUListElement;

    const textbox = Array.from(getAllByRole("textbox"))[1] as HTMLInputElement;
    const addButton = Array.from(getAllByText(/add/i))[1] as HTMLButtonElement;

    await userEvents.type(textbox, "foobar");
    userEvents.click(addButton);
    await userEvents.type(textbox, "quux");
    userEvents.click(addButton);

    let listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foobar", "quux"]);

    let checkboxes = within(sublist).getAllByRole(
      "checkbox"
    ) as HTMLInputElement[];
    expect(checkboxes.map((input) => input.checked)).toEqual([false, false]);

    userEvents.click(checkboxes[0]);
    checkboxes = within(sublist).getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.map((input) => input.checked)).toEqual([true, false]);

    userEvents.click(checkboxes[1]);
    checkboxes = within(sublist).getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.map((input) => input.checked)).toEqual([true, true]);

    userEvents.click(checkboxes[0]);
    checkboxes = within(sublist).getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.map((input) => input.checked)).toEqual([false, true]);
  });

  it("Check/Add/Remove", async () => {
    const { getByRole, getAllByRole, getAllByText } = render(
      <App items={["foo", "bar", "baz"]} />
    );

    const expandButtons = getExpandButtons(
      getByRole("list") as HTMLUListElement
    );
    userEvents.click(expandButtons[2]);

    const sublist = Array.from(getAllByRole("list"))[1] as HTMLUListElement;

    const textbox = Array.from(getAllByRole("textbox"))[1] as HTMLInputElement;
    const addButton = Array.from(getAllByText(/add/i))[1] as HTMLButtonElement;

    await userEvents.type(textbox, "foobar");
    userEvents.click(addButton);
    await userEvents.type(textbox, "qux");
    userEvents.click(addButton);
    await userEvents.type(textbox, "quux");
    userEvents.click(addButton);

    let listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foobar",
      "qux",
      "quux"
    ]);

    let checkboxes = within(sublist).getAllByRole(
      "checkbox"
    ) as HTMLInputElement[];
    let buttons = getDeleteButtons(sublist);

    userEvents.click(checkboxes[0]);
    userEvents.click(checkboxes[2]);
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foobar",
      "qux",
      "quux"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      false,
      true
    ]);

    userEvents.click(buttons[1]);
    checkboxes = within(sublist).getAllByRole("checkbox") as HTMLInputElement[];
    listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foobar", "quux"]);
    expect(checkboxes.map((input) => input.checked)).toEqual([true, true]);

    await userEvents.type(textbox, "bobo");
    userEvents.click(addButton);
    checkboxes = within(sublist).getAllByRole("checkbox") as HTMLInputElement[];
    listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foobar",
      "quux",
      "bobo"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      true,
      false
    ]);

    await userEvents.type(textbox, "bibi");
    userEvents.click(addButton);
    checkboxes = within(sublist).getAllByRole("checkbox") as HTMLInputElement[];
    listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foobar",
      "quux",
      "bobo",
      "bibi"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      true,
      false,
      false
    ]);

    userEvents.click(checkboxes[2]);
    checkboxes = within(sublist).getAllByRole("checkbox") as HTMLInputElement[];
    listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foobar",
      "quux",
      "bobo",
      "bibi"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      true,
      true,
      false
    ]);

    userEvents.click(checkboxes[3]);
    checkboxes = within(sublist).getAllByRole("checkbox") as HTMLInputElement[];
    listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foobar",
      "quux",
      "bobo",
      "bibi"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      true,
      true,
      true
    ]);

    userEvents.click(checkboxes[2]);
    checkboxes = within(sublist).getAllByRole("checkbox") as HTMLInputElement[];
    listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foobar",
      "quux",
      "bobo",
      "bibi"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      true,
      false,
      true
    ]);
  });
});
