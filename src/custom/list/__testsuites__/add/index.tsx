import { ReactElement } from "react";
import { fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
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
  const { textbox, addButton, expectTextContents } = render(ui);

  expect(textbox).toBeInTheDocument();
  expect(addButton).toBeInTheDocument();
  expectTextContents(defaultTexts);

  await userEvents.type(textbox, "foo");
  expectTextContents(defaultTexts);

  userEvents.click(addButton);
  expectTextContents(defaultTexts);

  await userEvents.type(textbox, "bar");
  expectTextContents(defaultTexts);

  fireEvent.keyPress(textbox, {
    key: "Enter",
    code: 13,
    charCode: 13,
    keyCode: 13
  });
  expectTextContents(defaultTexts);
};

const statefulTest = async ({ ui, render, props }: TestOptions) => {
  const defaultItems = props.defaultItems;

  if (!defaultItems) {
    throw new Error("undefined defaultItems");
  }

  const defaultTexts = defaultItems.map(item => item.text);
  const { textbox, addButton, expectTextContents } = render(ui);

  expect(textbox).toBeInTheDocument();
  expect(addButton).toBeInTheDocument();
  expectTextContents(defaultTexts);

  await userEvents.type(textbox, "foo");
  expectTextContents(defaultTexts);

  userEvents.click(addButton);
  expectTextContents(defaultTexts.concat(["foo"]));

  await userEvents.type(textbox, "bar");
  expectTextContents(defaultTexts.concat(["foo"]));

  fireEvent.keyPress(textbox, {
    key: "Enter",
    code: 13,
    charCode: 13,
    keyCode: 13
  });
  expectTextContents(defaultTexts.concat(["foo", "bar"]));
};

export function addTestSuite(
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
    description: "Adding an item"
  });
}

export default addTestSuite;
