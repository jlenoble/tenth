import testSuite from "./template";
import propList from "./propList";
import { render } from "@testing-library/react";
import {
  StatefulListWithDefaults,
  StatelessListWithDefaults
} from "../ListFactory";

export function instantiateTestSuite(
  StatelessList: StatelessListWithDefaults,
  StatefulList: StatefulListWithDefaults
) {
  testSuite({
    StatelessList,
    StatefulList,
    propList,
    render,
    description: "Instantiating without crashing"
  });
}

export default instantiateTestSuite;
