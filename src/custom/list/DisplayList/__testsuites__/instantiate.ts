import testSuite from "../../__testsuites__/instantiate";
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
  testSuite(StatelessList, StatefulList, [{ defaultItems }]);
}

export default instantiateTestSuite;
