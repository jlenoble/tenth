import { ReactElement } from "react";
import { render } from "./render";
import {
  StatelessListWithDefaults,
  StatefulListWithDefaults
} from "../../ListFactory";
import testSuite from "../template";

type TestOptions = { ui: ReactElement; render: typeof render };

const statelessTest = ({ ui, render }: TestOptions) => {
  const { expectChecks, checkNthChild } = render(ui);
  const result = defaultItems.map(item => item.checked);
  expectChecks(result);

  checkNthChild(0);
  expectChecks(result);

  checkNthChild(2);
  expectChecks(result);

  checkNthChild(0);
  expectChecks(result);
};

const statefulTest = ({ ui, render }: TestOptions) => {
  const { expectChecks, checkNthChild } = render(ui);
  const result = defaultItems.map(item => item.checked);
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

const defaultItems = [
  { id: "1", text: "a", checked: true },
  { id: "2", text: "b", checked: false },
  { id: "3", text: "c", checked: true }
];

export function checkTestSuite(
  StatelessList: StatelessListWithDefaults,
  StatefulList: StatefulListWithDefaults
) {
  const propList = [{ defaultItems }];
  const description = "Clicking on checkbox";

  testSuite({
    StatelessList,
    StatefulList,
    propList,
    statelessTest,
    statefulTest,
    render,
    description
  });
}

export default checkTestSuite;
