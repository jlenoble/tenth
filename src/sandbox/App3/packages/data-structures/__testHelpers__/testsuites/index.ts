import { TestSuite } from "../../../testsuite";
import { DataStructure, Constructor } from "../../types";
import { fillInitArgs } from "../fill-init-args";
import {
  tests as commonTests,
  staticTests as commonStaticTests,
} from "./common";
import { tests as linkedListTests } from "./linked-list";
import { tests as stackTests } from "./stack";
import { tests as queueTests } from "./queue";

export const tests = <T>(
  Structure: Constructor<DataStructure<T>>,
  initArgs: T[],
  {
    linkedList = false,
    stack = false,
    queue = false,
  }: { linkedList?: boolean; stack?: boolean; queue?: boolean } = {}
): TestSuite => {
  initArgs = fillInitArgs(initArgs);

  const allTests = [commonTests];
  if (linkedList) {
    allTests.push(linkedListTests);
  }
  if (stack) {
    allTests.push(stackTests);
  }
  if (queue) {
    allTests.push(queueTests);
  }

  return allTests.reduce(
    (
      testSuite: TestSuite,
      tests: (
        Structure: Constructor<DataStructure<T>>,
        initArgs: T[]
      ) => TestSuite
    ) => {
      return { ...testSuite, ...tests(Structure, initArgs) };
    },
    {}
  );
};

export const staticTests = <T>(options: {
  length: number;
  name: string;
  Structure: Constructor<DataStructure<T>>;
}): TestSuite => ({ ...commonStaticTests(options) });
