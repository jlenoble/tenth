import React, { FunctionComponent } from "react";

import { getDroppables, getDraggables } from "../__testHelpers__/dnd";
import { mockGetBoundingClientRect } from "../__testHelpers__/dnd-mock";
import { render } from "../__testHelpers__/dnd-render";

import { List as BaseList, withDnD, withItems, tmpId } from "..";

const StandaloneDnDList = withItems(withDnD(BaseList));

const List: FunctionComponent<{ items: string[] }> = ({ items }) => (
  <StandaloneDnDList
    ui={{ dnd: true }}
    defaultItems={items.map((item) => ({ id: tmpId(), primary: item }))}
  />
);

describe("DnD List", () => {
  it("Initialize", () => {
    const { getAllByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
  });

  it("Drag and drop", async () => {
    const { getAllByRole, container, dnd } = render(
      <List items={["foo", "bar", "baz", "quux"]} />
    );

    const droppables = getDroppables(container);

    droppables.forEach((droppable) => {
      mockGetBoundingClientRect(droppable);
      const draggables = getDraggables(droppable);
      draggables.forEach((draggable) => mockGetBoundingClientRect(draggable));
    });

    let listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz",
      "quux"
    ]);

    await dnd(0, 2);
    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "bar",
      "baz",
      "foo",
      "quux"
    ]);

    await dnd(0, 2);
    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "baz",
      "foo",
      "bar",
      "quux"
    ]);

    await dnd(1, 0);
    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "baz",
      "bar",
      "quux"
    ]);
  });
});
