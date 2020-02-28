import React from "react";
import { fireEvent, waitForElement } from "@testing-library/react";
import { DragDropContext } from "react-beautiful-dnd";
import InputList, { useItems } from "..";
import {
  render,
  fillWith,
  haveTextContents,
  onDragEnd,
  getDroppables,
  getDraggables,
  mockGetComputedStyle,
  mockGetBoundingClientRect
} from "../__helpers__";

const spaceKey = { keyCode: 32 };
const arrowUpKey = { keyCode: 38 };
const arrowDownKey = { keyCode: 40 };

const getIntermediaryElements = (
  items: HTMLElement[],
  start: number,
  end: number
) => {
  if (start === end) {
    return [];
  }

  if (start < end) {
    return items.slice(start + 1, end);
  }

  return items.reverse().slice(end + 1, start);
};

const dnd = async (
  start: number,
  end: number,
  {
    getByText,
    getItems
  }: {
    getByText: (regex: RegExp) => HTMLElement;
    getItems: () => HTMLElement[];
  }
) => {
  const items = getItems();
  const elements = getIntermediaryElements(items, start, end);
  const dragSource = items[start]!;

  dragSource.focus();
  fireEvent.keyDown(dragSource, spaceKey);

  for (let i = 0; i < elements.length; i++) {
    await waitForElement(() => getByText(/You have lifted an item/i));
    fireEvent.keyDown(dragSource, start < end ? arrowDownKey : arrowUpKey);
    await waitForElement(() => getByText(/You have moved the item/i));
  }

  fireEvent.keyDown(dragSource, start < end ? arrowDownKey : arrowUpKey);
  fireEvent.keyDown(dragSource, spaceKey);
  await waitForElement(() => getByText(/You have dropped the item/i));
};

describe("Items can moved within InputList", () => {
  beforeEach(() => {
    mockGetComputedStyle();
  });

  it("with DnD", async () => {
    function App() {
      const itemHooks = useItems([]);

      return (
        <DragDropContext onDragEnd={onDragEnd(itemHooks)}>
          <InputList dnd itemHooks={itemHooks} />
        </DragDropContext>
      );
    }

    const {
      container,
      list,
      textbox,
      addButton,
      getAllByRole,
      getByText
    } = render(<App />);
    await fillWith(textbox, addButton, ["foo", "bar", "baz"]);

    const getItems = () => getAllByRole("listitem");
    const droppables = getDroppables(container);

    droppables.forEach(droppable => {
      mockGetBoundingClientRect(droppable);
      const draggables = getDraggables(droppable);
      draggables.forEach(draggable => mockGetBoundingClientRect(draggable));
    });

    await dnd(0, 2, { getByText, getItems });
    haveTextContents(list, ["bar", "baz", "foo"]);

    await dnd(0, 2, { getByText, getItems });
    haveTextContents(list, ["baz", "foo", "bar"]);

    await dnd(1, 0, { getByText, getItems });
    haveTextContents(list, ["foo", "baz", "bar"]);
  });
});
