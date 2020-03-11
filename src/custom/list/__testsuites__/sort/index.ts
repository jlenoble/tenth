import { ReactElement } from "react";
import { getDroppables, getDraggables } from "./dnd";
import { mockGetComputedStyle, mockGetBoundingClientRect } from "./mock";
import { render } from "./render";
import {
  StatelessListWithDefaults,
  StatefulListWithDefaults,
  Props
} from "../../ListFactory";
import testSuite from "../template";
import propList from "../propList";

type TestOptions = {
  ui: ReactElement;
  render: typeof render;
  props: Props;
};

const statelessTest = async ({ ui, render, props }: TestOptions) => {
  const defaultItems = props.defaultItems;

  if (!defaultItems) {
    throw new Error("undefined defaultItems");
  }

  const defaultTexts = defaultItems.map(item => item.text);
  const { container, expectTextContents, dnd } = render(ui);

  const droppables = getDroppables(container);

  droppables.forEach(droppable => {
    mockGetBoundingClientRect(droppable);
    const draggables = getDraggables(droppable);
    draggables.forEach(draggable => mockGetBoundingClientRect(draggable));
  });

  expectTextContents(defaultTexts);

  await dnd(0, 2);
  expectTextContents(defaultTexts);

  await dnd(0, 2);
  expectTextContents(defaultTexts);

  await dnd(1, 0);
  expectTextContents(defaultTexts);
};

const statefulTest = async ({ ui, render, props }: TestOptions) => {
  const defaultItems = props.defaultItems;

  if (!defaultItems) {
    throw new Error("undefined defaultItems");
  }

  const defaultTexts = defaultItems.map(item => item.text);
  const { container, expectTextContents, dnd } = render(ui);

  const droppables = getDroppables(container);

  droppables.forEach(droppable => {
    mockGetBoundingClientRect(droppable);
    const draggables = getDraggables(droppable);
    draggables.forEach(draggable => mockGetBoundingClientRect(draggable));
  });

  expectTextContents(defaultTexts);

  await dnd(0, 2);
  let text = defaultTexts[0];
  defaultTexts.splice(0, 1);
  defaultTexts.splice(2, 0, text);
  expectTextContents(defaultTexts);

  await dnd(0, 2);
  text = defaultTexts[0];
  defaultTexts.splice(0, 1);
  defaultTexts.splice(2, 0, text);
  expectTextContents(defaultTexts);

  await dnd(1, 0);
  text = defaultTexts[1];
  defaultTexts.splice(1, 1);
  defaultTexts.splice(0, 0, text);
  expectTextContents(defaultTexts);
};

export function deleteTestSuite(
  StatelessList: StatelessListWithDefaults,
  StatefulList: StatefulListWithDefaults
) {
  testSuite({
    StatelessList,
    StatefulList,
    propList,
    statelessTest,
    statefulTest,
    render,
    description: "Sorting items"
  });
}

export default deleteTestSuite;
