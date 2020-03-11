import { ReactElement } from "react";
import { render } from "../../__testsuites__/check/render";
import { StatefulListWithDefaults, Props } from "../ListFactory";
import testSuite from "./template";
import propList, {
  localStorageId,
  defaultLocalStorageItems
} from "./init-data";
import { fetchItems } from "./localstorage";

type TestOptions = {
  ui: ReactElement;
  render: typeof render;
  props: Props;
};

const statefulTest = ({ ui, render, props }: TestOptions) => {
  let defaultItems = props.defaultItems;
  const fetch = fetchItems(props.localStorageId);

  if (!defaultItems) {
    defaultItems = fetch();
  }

  const { expectChecks, checkNthChild } = render(ui);
  const result = defaultItems.map(item => item.checked);
  const storageResult = defaultItems.map(item => ({ ...item }));

  expectChecks(result);
  expect(fetch()).toEqual(defaultLocalStorageItems);

  checkNthChild(0);
  result[0] = !result[0];
  storageResult[0].checked = result[0];
  expectChecks(result);
  expect(fetch()).not.toEqual(defaultLocalStorageItems);
  expect(fetch()).toEqual(storageResult);

  checkNthChild(2);
  result[2] = !result[2];
  storageResult[2].checked = result[2];
  expectChecks(result);
  expect(fetch()).toEqual(storageResult);

  checkNthChild(0);
  result[0] = !result[0];
  storageResult[0].checked = result[0];
  expectChecks(result);
  expect(fetch()).toEqual(storageResult);
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
