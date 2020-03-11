import { ReactElement } from "react";
import { render } from "../../__testsuites__/sort/render";
import { getDroppables, getDraggables } from "../../__testsuites__/sort/dnd";
import { mockGetBoundingClientRect } from "../../__testsuites__/sort/mock";
import { StatefulListWithDefaults, Props } from "../ListFactory";
import testSuite from "./template";
import propList, {
  localStorageId,
  defaultLocalStorageItems
} from "./init-data";
import { fetch } from "../localstorage";

type TestOptions = {
  ui: ReactElement;
  render: typeof render;
  props: Props;
};

const statefulTest = async ({ ui, render, props }: TestOptions) => {
  let defaultItems = props.defaultItems;
  const fetchItems = fetch(props.localStorageId);

  if (!defaultItems) {
    defaultItems = fetchItems();
  }

  const defaultTexts = defaultItems.map(item => item.text);
  const { container, expectTextContents, dnd } = render(ui);
  const storageResult = defaultItems.map(item => ({ ...item }));

  const droppables = getDroppables(container);

  droppables.forEach(droppable => {
    mockGetBoundingClientRect(droppable);
    const draggables = getDraggables(droppable);
    draggables.forEach(draggable => mockGetBoundingClientRect(draggable));
  });

  expectTextContents(defaultTexts);
  expect(fetchItems()).toEqual(defaultLocalStorageItems);

  await dnd(0, 2);
  let text = defaultTexts[0];
  let item = storageResult[0];
  defaultTexts.splice(0, 1);
  defaultTexts.splice(2, 0, text);
  storageResult.splice(0, 1);
  storageResult.splice(2, 0, item);
  expectTextContents(defaultTexts);
  expect(fetchItems()).not.toEqual(defaultLocalStorageItems);
  expect(fetchItems()).toEqual(storageResult);

  await dnd(0, 2);
  text = defaultTexts[0];
  item = storageResult[0];
  defaultTexts.splice(0, 1);
  defaultTexts.splice(2, 0, text);
  storageResult.splice(0, 1);
  storageResult.splice(2, 0, item);
  expectTextContents(defaultTexts);
  expect(fetchItems()).toEqual(storageResult);

  await dnd(1, 0);
  text = defaultTexts[1];
  item = storageResult[1];
  defaultTexts.splice(1, 1);
  defaultTexts.splice(0, 0, text);
  storageResult.splice(1, 1);
  storageResult.splice(0, 0, item);
  expectTextContents(defaultTexts);
  expect(fetchItems()).toEqual(storageResult);
};

export function addTestSuite(StatefulList: StatefulListWithDefaults) {
  testSuite({
    Component: StatefulList,
    propList,
    test: statefulTest,
    render,
    description: "Sorting items",
    localStorageId
  });
}

export default addTestSuite;
