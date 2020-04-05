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

const statelessTest = ({ ui, render, props }: TestOptions) => {
  const defaultItems = props.defaultItems;

  if (!defaultItems) {
    throw new Error("undefined defaultItems");
  }

  const { expectChecks, checkNthChild } = render(ui);
  const result = defaultItems.map((item) => item.checked);
  expectChecks(result);

  checkNthChild(0);
  expectChecks(result);

  checkNthChild(2);
  expectChecks(result);

  checkNthChild(0);
  expectChecks(result);
};

const statefulTest = ({ ui, render, props }: TestOptions) => {
  const defaultItems = props.defaultItems;

  if (!defaultItems) {
    throw new Error("undefined defaultItems");
  }

  const { expectChecks, checkNthChild } = render(ui);
  const result = defaultItems.map((item) => item.checked);
  expectChecks(result);

  checkNthChild(0);
  result[0] = !result[0];
  expectChecks(result);

  checkNthChild(2);
  result[2] = !result[2];
  expectChecks(result);

  checkNthChild(0);
  result[0] = !result[0];
  expectChecks(result);
};

export function checkTestSuite(
  StatelessList: StatelessListWithDefaults,
  StatefulList: StatefulListWithDefaults
) {
  testSuite({
    StatelessList,
    StatefulList,
    propList,
    statelessTest: statefulTest,
    statefulTest,
    render,
    description: "Clicking on checkbox"
  });
}

export default checkTestSuite;
