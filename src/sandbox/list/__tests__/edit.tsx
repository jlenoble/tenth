import React, { FunctionComponent } from "react";

import { render, fireEvent, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";

import { List as BaseList, withItems, tmpId } from "..";

const StandaloneList = withItems(BaseList);
const List: FunctionComponent<{ items: string[] }> = ({ items }) => (
  <StandaloneList
    ui={{ inlineEdit: true }}
    defaultItems={items.map((item) => ({ id: tmpId(), primary: item }))}
  />
);

describe("List", () => {
  it("Edit", async () => {
    const { getByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];
    let listitem = listitems[1];
    const { getByRole: subGetByRole, getByText } = within(listitem);

    let text = getByText("bar") as HTMLSpanElement;

    userEvents.click(text);
    expect(text).not.toBeInTheDocument();

    let textbox = subGetByRole("textbox") as HTMLInputElement;

    await userEvents.type(textbox, "bozo");
    fireEvent.keyPress(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });
    expect(textbox).not.toBeInTheDocument();

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "barbozo",
      "baz"
    ]);
  });
});
