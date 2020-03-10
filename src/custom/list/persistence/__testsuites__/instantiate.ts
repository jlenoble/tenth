import testSuite, { dummyTest } from "./template";
import propList, { localStorageId } from "./init-data";
import { render } from "@testing-library/react";
import { StatefulListWithDefaults } from "../ListFactory";

export function instantiateTestSuite(StatefulList: StatefulListWithDefaults) {
  testSuite({
    Component: StatefulList,
    propList,

    // Typescript needs statelessTest and statefulTest to infer the type of render.
    // Though statelessTest and statefulTest are optional, their type is
    // tied to that of render and their presence allows to narrow it down enough
    // for the compilation not to fail (as of typescript 3.8.3)
    test: dummyTest,
    render,

    description: "Instantiating without crashing",
    localStorageId
  });
}

export default instantiateTestSuite;
