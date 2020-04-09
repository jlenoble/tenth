import React, { FunctionComponent, useState } from "react";

import { render } from "@testing-library/react";
import userEvents from "@testing-library/user-event";

import { IconButton } from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";

import {
  List as MuiList,
  ListProps as MuiListProps,
  ListItem as MuiListItem,
  ListItemProps as MuiListItemProps,
  ListItemText,
  ListItemTextProps
} from "../../../core/base";

const useItems = (initialItems: string[] = []) => {
  const [items, setItems] = useState(initialItems);

  return {
    items,
    remove: (index: number) => {
      setItems(items.filter((_, i) => index !== i));
    }
  };
};

const ListItem: FunctionComponent<
  {
    hooks: { primary: string; remove: () => void };
    listItemTextProps?: ListItemTextProps;
  } & MuiListItemProps
> = ({ hooks: { primary, remove }, listItemTextProps, ...listItemProps }) => {
  return (
    <MuiListItem {...listItemProps}>
      <ListItemText primary={primary} {...listItemTextProps} />
      <IconButton aria-label="Delete item" onClick={remove}>
        <DeleteOutlined />
      </IconButton>
    </MuiListItem>
  );
};

const List: FunctionComponent<
  { items?: string[]; listItemProps?: MuiListItemProps } & MuiListProps
> = ({ items: initialItems = [], listItemProps, ...listProps }) => {
  const { items, remove } = useItems(initialItems);

  return (
    <MuiList {...listProps}>
      {items.map((item, i) => {
        const hooks = {
          primary: item,
          remove: () => remove(i)
        };

        return <ListItem key={i} hooks={hooks} {...listItemProps} />;
      })}
    </MuiList>
  );
};

describe("List", () => {
  it("Initialize", () => {
    const { getAllByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
  });

  it("Remove", () => {
    const { getAllByRole } = render(<List items={["foo", "bar", "baz"]} />);

    let buttons = getAllByRole("button") as HTMLButtonElement[];
    userEvents.click(buttons[0]);

    let listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["bar", "baz"]);

    buttons = getAllByRole("button") as HTMLButtonElement[];
    userEvents.click(buttons[1]);

    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["bar"]);

    buttons = getAllByRole("button") as HTMLButtonElement[];
    userEvents.click(buttons[0]);

    try {
      getAllByRole("listitem");
    } catch (e) {
      expect(e.message).toContain(
        `Unable to find an accessible element with the role "listitem"`
      );
    }
  });
});
