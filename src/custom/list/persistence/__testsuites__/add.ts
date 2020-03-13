import { ReactElement } from "react";
import { fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { render } from "../../__testsuites__/add/render";
import { StatefulListWithDefaults, Props } from "../ListFactory";
import testSuite from "./template";
import propList, {
  localStorageId,
  defaultLocalStorageItems
} from "./init-data";
import { fetch } from "../localstorage";
import defaultTmpId from "../../../defaultTmpId";

type TestOptions = {
  ui: ReactElement;
  render: typeof render;
  props: Props;
};

const statefulTest = async ({ ui, render, props }: TestOptions) => {
  let defaultItems = props.defaultItems;
  const fetchItems = fetch(props.localStorageId);
  const match = defaultTmpId().match(/([A-Za-z_]*)(\d+)/);
  const prefix = match![1];
  const id0 = parseInt(match![2], 10);

  if (!defaultItems) {
    defaultItems = fetchItems();
  }

  const defaultTexts = defaultItems.map(item => item.text);
  const { textbox, addButton, expectTextContents } = render(ui);
  const storageResult = defaultItems.map(item => ({ ...item }));

  expect(textbox).toBeInTheDocument();
  expect(addButton).toBeInTheDocument();
  expectTextContents(defaultTexts);
  expect(fetchItems()).toEqual(defaultLocalStorageItems);

  await userEvents.type(textbox, "foo");
  expectTextContents(defaultTexts);
  expect(fetchItems()).toEqual(defaultLocalStorageItems);

  userEvents.click(addButton);
  expectTextContents(defaultTexts.concat(["foo"]));
  expect(fetchItems()).not.toEqual(defaultLocalStorageItems);
  expect(fetchItems()).toEqual(
    storageResult.concat([
      { checked: false, text: "foo", id: prefix + (id0 + 1), edited: false }
    ])
  );

  await userEvents.type(textbox, "bar");
  expectTextContents(defaultTexts.concat(["foo"]));
  expect(fetchItems()).toEqual(
    storageResult.concat([
      { checked: false, text: "foo", id: prefix + (id0 + 1), edited: false }
    ])
  );

  fireEvent.keyPress(textbox, {
    key: "Enter",
    code: 13,
    charCode: 13,
    keyCode: 13
  });
  expectTextContents(defaultTexts.concat(["foo", "bar"]));
  expect(fetchItems()).toEqual(
    storageResult.concat([
      { checked: false, text: "foo", id: prefix + (id0 + 1), edited: false },
      { checked: false, text: "bar", id: prefix + (id0 + 2), edited: false }
    ])
  );
};

export function addTestSuite(StatefulList: StatefulListWithDefaults) {
  testSuite({
    Component: StatefulList,
    propList,
    test: statefulTest,
    render,
    description: "Adding an item",
    localStorageId
  });
}

export default addTestSuite;
