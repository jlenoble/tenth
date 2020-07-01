import { TestSuite } from "../../../testsuite";
import { HeapConstructor } from "../../heap";
import { fillInitArgs } from "../fill-init-args";
import { tests as commonTests } from "./common";

export const tests = <T>(
  Structure: HeapConstructor<T>,
  initArgs: T[]
): TestSuite => {
  initArgs = fillInitArgs(initArgs);

  return { ...commonTests(Structure, initArgs) };
};
