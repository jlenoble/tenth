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

  const { expectTextContents, editNthChild } = render(ui);
  const result = defaultItems.map(item => item.text);
  expectTextContents(result);

  try {
    await editNthChild(0, "foo");
  } catch (e) {
    expect(e.message).toEqual(`Missing ${0}th ListItemTextField`);
  }

  expectTextContents(result);

  try {
    await editNthChild(2, "bar");
  } catch (e) {
    expect(e.message).toEqual(`Missing ${2}th ListItemTextField`);
  }
  expectTextContents(result);

  try {
    await editNthChild(0, "baz");
  } catch (e) {
    expect(e.message).toEqual(`Missing ${0}th ListItemTextField`);
  }
  expectTextContents(result);
};

const statefulTest = async ({ ui, render, props }: TestOptions) => {
  const defaultItems = props.defaultItems;

  if (!defaultItems) {
    throw new Error("undefined defaultItems");
  }

  const { expectTextContents, editNthChild } = render(ui);
  const result = defaultItems.map(item => item.text);
  expectTextContents(result);

  await editNthChild(0, "foo");
  result[0] = result[0] + "foo";
  expectTextContents(result);

  await editNthChild(2, "bar");
  result[2] = result[2] + "bar";
  expectTextContents(result);

  await editNthChild(0, "baz");
  result[0] = result[0] + "baz";
  expectTextContents(result);
};

export function editTestSuite(
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
    description: "Inline editing"
  });
}

export default editTestSuite;
