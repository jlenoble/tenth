import React from "react";
import { render, fireEvent, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { App, getDeleteButtons, getExpandButtons } from "../../__testHelpers__";

describe("Todo sublist", () => {
  test.todo("Remove parent");
  // it("Remove parent", async () => {
  //   const { getByRole, getAllByRole, getAllByText } = render(
  //     <App items={["foo", "bar", "baz"]} />
  //   );

  //   const expandButtons = getExpandButtons(
  //     getByRole("list") as HTMLUListElement
  //   );
  //   userEvents.click(expandButtons[2]);

  //   const list = Array.from(getAllByRole("list"))[0] as HTMLUListElement;
  //   const sublist = Array.from(getAllByRole("list"))[1] as HTMLUListElement;

  //   const textbox = Array.from(getAllByRole("textbox"))[1] as HTMLInputElement;
  //   const addButton = Array.from(getAllByText(/add/i))[1] as HTMLButtonElement;

  //   await userEvents.type(textbox, "foobar");
  //   userEvents.click(addButton);
  //   await userEvents.type(textbox, "quux");
  //   userEvents.click(addButton);

  //   let listitems = within(sublist).getAllByRole("listitem") as HTMLLIElement[];
  //   expect(listitems.map((li) => li.textContent)).toEqual(["foobar", "quux"]);

  //   let buttons = getDeleteButtons(list);
  //   userEvents.click(buttons[2]);

  //   expect(sublist).not.toBeInTheDocument();
  // });
});
