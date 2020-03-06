import testSuite, { dummyTest } from "./template";
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

    // Typescript needs statelessTest and statefulTest to infer the type of render.
    // Though statelessTest and statefulTest are optional, their type is
    // tied to that of render and their presence allows to narrow it down enough
    // for the compilation not to fail (as of typescript 3.8.3)
    statelessTest: dummyTest,
    statefulTest: dummyTest,
    render,

    description: "Instantiating without crashing"
  });
}

export default instantiateTestSuite;
