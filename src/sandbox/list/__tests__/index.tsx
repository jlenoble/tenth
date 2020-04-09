import React, { FunctionComponent, useState } from "react";

import { render, fireEvent, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";

import {
  Paper,
  Grid,
  TextField,
  Button,
  Checkbox,
  IconButton
} from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";

import {
  List as BaseList,
  ListProps as BaseListProps,
  ListItem as BaseListItem,
  ListItemProps as BaseListItemProps,
  ListItemText,
  ListItemTextProps
} from "../../../core/base";

import { useInputValue } from "../../../core/states";

interface Item {
  primary: string;
  selected: boolean;
}

const useItems = (initialItems: string[] = []) => {
  const [items, setItems] = useState(
    initialItems.map((item) => ({ primary: item, selected: false }))
  );

  return {
    items,
    add: (value: string) => {
      setItems(items.concat({ primary: value, selected: false }));
    },
    remove: (index: number) => {
      setItems(items.filter((_, i) => index !== i));
    },
    toggleSelection: (index: number) => {
      setItems(
        items.map((item, i) =>
          i !== index ? item : { ...item, selected: !item.selected }
        )
      );
    }
  };
};

const ListItem: FunctionComponent<
  {
    hooks: Item & {
      remove: () => void;
      toggleSelection: () => void;
    };
    listItemTextProps?: ListItemTextProps;
  } & BaseListItemProps
> = ({
  hooks: { primary, selected, remove, toggleSelection },
  listItemTextProps,
  ...listItemProps
}) => {
  return (
    <BaseListItem {...listItemProps}>
      <Checkbox onClick={toggleSelection} checked={selected} />
      <ListItemText primary={primary} {...listItemTextProps} />
      <IconButton aria-label="Delete item" onClick={remove}>
        <DeleteOutlined />
      </IconButton>
    </BaseListItem>
  );
};

const List: FunctionComponent<
  { items?: string[]; listItemProps?: BaseListItemProps } & BaseListProps
> = ({ items: initialItems = [], listItemProps, ...listProps }) => {
  const { items, add, remove, toggleSelection } = useItems(initialItems);
  const { inputValue, changeInput, keyInput, clearInputAndAdd } = useInputValue(
    add
  );

  return (
    <>
      <Paper style={{ margin: 16, padding: 16 }}>
        <Grid container>
          <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
            <TextField
              placeholder="Add item here"
              value={inputValue}
              onChange={changeInput}
              onKeyPress={keyInput}
              fullWidth
            />
          </Grid>
          <Grid xs={2} md={1} item>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              onClick={clearInputAndAdd}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <BaseList {...listProps}>
        {items.map((item, i) => {
          const hooks = {
            ...item,
            remove: () => remove(i),
            toggleSelection: () => toggleSelection(i)
          };

          return <ListItem key={i} hooks={hooks} {...listItemProps} />;
        })}
      </BaseList>
    </>
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

  it("Add", async () => {
    const { getByRole, getByText, getAllByRole } = render(
      <List items={["foo"]} />
    );

    const textbox = getByRole("textbox") as HTMLInputElement;
    const addButton = getByText(/add/i) as HTMLButtonElement;

    await userEvents.type(textbox, "bar");

    let listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foo"]);

    userEvents.click(addButton);

    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foo", "bar"]);

    await userEvents.type(textbox, "baz");

    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foo", "bar"]);

    fireEvent.keyPress(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });

    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
  });

  it("Remove", () => {
    const { getByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

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

  it("Select", () => {
    const { getByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.map((input) => input.checked)).toEqual([
      false,
      false,
      false
    ]);

    userEvents.click(checkboxes[0]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      false,
      false
    ]);

    userEvents.click(checkboxes[1]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      true,
      false
    ]);

    userEvents.click(checkboxes[0]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      false,
      true,
      false
    ]);
  });

  it("Select/Add/Remove", async () => {
    const { getByRole, getByText } = render(
      <List items={["foo", "bar", "baz"]} />
    );

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const textbox = getByRole("textbox") as HTMLInputElement;
    const addButton = getByText(/add/i) as HTMLButtonElement;

    let checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    let listitems = getAllByRole("listitem") as HTMLLIElement[];
    let buttons = getAllByRole("button") as HTMLButtonElement[];

    userEvents.click(checkboxes[0]);
    userEvents.click(checkboxes[2]);
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      false,
      true
    ]);

    userEvents.click(buttons[1]);
    checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foo", "baz"]);
    expect(checkboxes.map((input) => input.checked)).toEqual([true, true]);

    await userEvents.type(textbox, "quux");
    userEvents.click(addButton);
    checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "baz",
      "quux"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      true,
      false
    ]);
  });
});
