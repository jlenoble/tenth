import { fireEvent, waitForElement } from "@testing-library/react";

export const DROPPABLE_ATTRIBUTE = "[data-rbd-droppable-id]";
export const DRAGGABLE_ATTRIBUTE = "[data-rbd-draggable-id]";

export const getDroppable = (container: HTMLElement): HTMLElement | null => {
  return container.querySelector(DROPPABLE_ATTRIBUTE);
};

export const getDraggable = (container: HTMLElement): HTMLElement | null => {
  return container.querySelector(DRAGGABLE_ATTRIBUTE);
};

export const getDroppables = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll(DROPPABLE_ATTRIBUTE));
};

export const getDraggables = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll(DRAGGABLE_ATTRIBUTE));
};

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

  return Array.from(items)
    .reverse()
    .slice(end + 1, start);
};

export const dragAndDrop = async (
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
