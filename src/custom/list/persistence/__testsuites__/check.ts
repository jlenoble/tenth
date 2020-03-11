import { ReactElement } from "react";
import { render } from "../../__testsuites__/check/render";
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

const statefulTest = ({ ui, render, props }: TestOptions) => {
  let defaultItems = props.defaultItems;
  const fetchItems = fetch(props.localStorageId);

  if (!defaultItems) {
    defaultItems = fetchItems();
  }

  const { expectChecks, checkNthChild } = render(ui);
  const result = defaultItems.map(item => item.checked);
  const storageResult = defaultItems.map(item => ({ ...item }));

  expectChecks(result);
  expect(fetchItems()).toEqual(defaultLocalStorageItems);

  checkNthChild(0);
  result[0] = !result[0];
  storageResult[0].checked = result[0];
  expectChecks(result);
  expect(fetchItems()).not.toEqual(defaultLocalStorageItems);
  expect(fetchItems()).toEqual(storageResult);

  checkNthChild(2);
  result[2] = !result[2];
  storageResult[2].checked = result[2];
  expectChecks(result);
  expect(fetchItems()).toEqual(storageResult);

  checkNthChild(0);
  result[0] = !result[0];
  storageResult[0].checked = result[0];
  expectChecks(result);
  expect(fetchItems()).toEqual(storageResult);
};

export function checkTestSuite(StatefulList: StatefulListWithDefaults) {
  testSuite({
    Component: StatefulList,
    propList,
    test: statefulTest,
    render,
    description: "Clicking on checkbox",
    localStorageId
  });
}

export default checkTestSuite;
