import { ReactElement } from "react";
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
  const { removeNthChild, expectTextContents } = render(ui);

  expectTextContents(defaultTexts);

  removeNthChild(0);
  expectTextContents(defaultTexts);

  removeNthChild(1);
  expectTextContents(defaultTexts);

  removeNthChild(0);
  expectTextContents(defaultTexts);
};

const statefulTest = async ({ ui, render, props }: TestOptions) => {
  const defaultItems = props.defaultItems;

  if (!defaultItems) {
    throw new Error("undefined defaultItems");
  }

  const defaultTexts = defaultItems.map(item => item.text);
  const { list, removeNthChild, expectTextContents } = render(ui);

  expectTextContents(defaultTexts);

  removeNthChild(0);
  expectTextContents(defaultTexts.slice(1));

  removeNthChild(1);
  expectTextContents(defaultTexts.slice(1, 2));

  removeNthChild(0);
  expect(list).toBeEmpty();
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
    description: "Deleting an item"
  });
}

export default deleteTestSuite;
