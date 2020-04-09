import React, { FunctionComponent } from "react";
import { render } from "@testing-library/react";
import {
  List as MuiList,
  ListProps as MuiListProps,
  ListItem as MuiListItem,
  ListItemProps as MuiListItemProps
} from "../../../core/base";

const ListItem: FunctionComponent<{ item: string } & MuiListItemProps> = ({
  item,
  ...listItemProps
}) => {
  return <MuiListItem {...listItemProps}>{item}</MuiListItem>;
};

const List: FunctionComponent<
  { items?: string[]; listItemProps?: MuiListItemProps } & MuiListProps
> = ({ items = [], listItemProps, ...listProps }) => {
  return (
    <MuiList {...listProps}>
      {items.map((item, i) => (
        <ListItem key={i} item={item} {...listItemProps} />
      ))}
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
});
