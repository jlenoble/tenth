import { ReactElement } from "react";
import { render } from "../../__testsuites__/delete/render";
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
  const { removeNthChild, expectTextContents } = render(ui);
  const storageResult = defaultItems.map(item => ({ ...item }));

  expectTextContents(defaultTexts);
  expect(fetchItems()).toEqual(defaultLocalStorageItems);

  removeNthChild(0);
  storageResult.splice(0, 1);
  expectTextContents(defaultTexts.slice(1));
  expect(fetchItems()).not.toEqual(defaultLocalStorageItems);
  expect(fetchItems()).toEqual(storageResult);

  removeNthChild(1);
  storageResult.splice(1, 1);
  expectTextContents(defaultTexts.slice(1, 2).concat(defaultTexts.slice(3)));
  expect(fetchItems()).toEqual(storageResult);

  removeNthChild(0);
  storageResult.splice(0, 1);
  expectTextContents(defaultTexts.slice(3));
  expect(fetchItems()).toEqual(storageResult);
};

export function deleteTestSuite(StatefulList: StatefulListWithDefaults) {
  testSuite({
    Component: StatefulList,
    propList,
    test: statefulTest,
    render,
    description: "Deleting an item",
    localStorageId
  });
}

export default deleteTestSuite;
