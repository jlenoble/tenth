import testSuite from "../../__testsuites__";
import { render } from "@testing-library/react";
import {
  StatefulListWithDefaults,
  StatelessListWithDefaults
} from "../../ListFactory";

const defaultItems = [
  { id: "1", text: "a", checked: true },
  { id: "2", text: "b", checked: false },
  { id: "3", text: "c", checked: true }
];

export function instantiateTestSuite(
  StatelessList: StatelessListWithDefaults,
  StatefulList: StatefulListWithDefaults
) {
  testSuite({
    StatelessList,
    StatefulList,
    propList: [{ defaultItems }],
    render,
    description: "Instantiating without crashing"
  });
}

export default instantiateTestSuite;
