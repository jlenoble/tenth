import { ReactElement } from "react";
import { render } from "../../__testsuites__/edit/render";
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

  const { expectTextContents, editNthChild } = render(ui);
  const result = defaultItems.map(item => item.text);
  const storageResult = defaultItems.map(item => ({ ...item }));

  expectTextContents(result);
  expect(fetchItems()).toEqual(defaultLocalStorageItems);

  await editNthChild(0, "foo");
  result[0] = result[0] + "foo";
  storageResult[0].text = result[0];
  expectTextContents(result);
  expect(fetchItems()).not.toEqual(defaultLocalStorageItems);
  expect(fetchItems()).toEqual(storageResult);

  await editNthChild(2, "bar");
  result[2] = result[2] + "bar";
  storageResult[2].text = result[2];
  expectTextContents(result);
  expect(fetchItems()).toEqual(storageResult);

  await editNthChild(0, "baz");
  result[0] = result[0] + "baz";
  storageResult[0].text = result[0];
  expectTextContents(result);
  expect(fetchItems()).toEqual(storageResult);
};

export function editTestSuite(StatefulList: StatefulListWithDefaults) {
  testSuite({
    Component: StatefulList,
    propList,
    test: statefulTest,
    render,
    description: "Inline editing",
    localStorageId
  });
}

export default editTestSuite;
