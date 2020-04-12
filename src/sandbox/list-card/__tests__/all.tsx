import React, { FunctionComponent } from "react";

import {
  render,
  within,
  waitForElementToBeRemoved
} from "@testing-library/react";
import userEvents from "@testing-library/user-event";

import { tmpId } from "../../list";
import { ListCard as BaseList, withCollection } from "..";

const HEADER_ATTRIBUTE = ".MuiCardHeader-root";
const CONTENT_ATTRIBUTE = ".MuiCardContent-root";
const POPOVER_ATTRIBUTE = ".MuiPopover-root";
const MENU_ATTRIBUTE = ".MuiPopover-paper";

const StandaloneList = withCollection(BaseList);
const List: FunctionComponent<{ items: string[] }> = ({ items }) => (
  <StandaloneList
    defaultCollection={{
      id: tmpId(),
      title: "Test ListCard",
      items: items.map((item) => ({ id: tmpId(), primary: item }))
    }}
  />
);

describe("ListCard", () => {
  it("Clear list", async () => {
    const { container } = render(<List items={["foo", "bar", "baz"]} />);
    const cardHeader = container.querySelector(HEADER_ATTRIBUTE) as HTMLElement;
    const cardContent = container.querySelector(
      CONTENT_ATTRIBUTE
    ) as HTMLElement;
    const button = within(cardHeader).getByRole("button") as HTMLButtonElement;
    let listitems = Array.from(
      within(cardContent).getAllByRole("listitem") as HTMLLIElement[]
    );

    userEvents.click(button);

    let menu = document.querySelector(MENU_ATTRIBUTE) as HTMLElement;
    let menuitems = Array.from(
      within(menu).getAllByRole("menuitem") as HTMLLIElement[]
    );

    menuitems.forEach((item) =>
      expect(item).toHaveAttribute("aria-disabled", "false")
    );

    const clearListItem = menuitems.filter(
      (item) => item.textContent === "Clear list"
    )[0];

    expect(listitems.map((item) => item.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);

    userEvents.click(clearListItem);
    listitems = Array.from(
      within(cardContent).queryAllByRole("listitem") as HTMLLIElement[]
    );
    expect(listitems).toEqual([]);

    await waitForElementToBeRemoved(menu);

    userEvents.click(button);

    menu = document.querySelector(MENU_ATTRIBUTE) as HTMLElement;
    menuitems = Array.from(
      within(menu).getAllByRole("menuitem") as HTMLLIElement[]
    );

    menuitems.forEach((item) =>
      expect(item).toHaveAttribute("aria-disabled", "true")
    );
  });

  it("Check all", async () => {
    const { container } = render(<List items={["foo", "bar", "baz"]} />);
    const cardHeader = container.querySelector(HEADER_ATTRIBUTE) as HTMLElement;
    const cardContent = container.querySelector(
      CONTENT_ATTRIBUTE
    ) as HTMLElement;
    const button = within(cardHeader).getByRole("button") as HTMLButtonElement;
    const checkboxes = Array.from(
      within(cardContent).getAllByRole("checkbox") as HTMLInputElement[]
    );

    userEvents.click(button);

    const menu = document.querySelector(MENU_ATTRIBUTE) as HTMLElement;
    const menuitems = Array.from(
      within(menu).getAllByRole("menuitem") as HTMLLIElement[]
    );
    const checkAllItem = menuitems.filter(
      (item) => item.textContent === "Check all"
    )[0];
    const checkbox = within(checkAllItem).getByRole("checkbox");

    userEvents.click(checkbox);
    expect(checkboxes.map((item) => item.checked)).toEqual([true, true, true]);

    userEvents.click(checkbox);
    expect(checkboxes.map((item) => item.checked)).toEqual([
      false,
      false,
      false
    ]);

    userEvents.click(checkAllItem);
    expect(checkboxes.map((item) => item.checked)).toEqual([true, true, true]);

    userEvents.click(checkAllItem);
    expect(checkboxes.map((item) => item.checked)).toEqual([
      false,
      false,
      false
    ]);

    const popover = document.querySelector(POPOVER_ATTRIBUTE) as HTMLElement;

    // This hidden element covers the whole screen and has the eventHandler
    // for closing the popover.
    userEvents.click(popover.querySelector("[aria-hidden]") as HTMLElement);
    expect(menu).toBeInTheDocument();

    await waitForElementToBeRemoved(menu);
  });
});
