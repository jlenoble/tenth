import { TestSuite } from "../../../testsuite";
import { DataStructure, Constructor, Node } from "../../types";
import { fillInitArgs } from "../fill-init-args";
import {
  tests as commonTests,
  staticTests as commonStaticTests,
} from "./common";
import { tests as linkedListTests } from "./linked-list";
import { tests as stackTests } from "./stack";

export const tests = <T, N extends Node<T>>(
  Structure: Constructor<DataStructure<T, N>>,
  initArgs: T[]
): TestSuite => {
  initArgs = fillInitArgs(initArgs);

  return {
    ...commonTests(Structure, initArgs),
    ...linkedListTests(Structure, initArgs),
    ...stackTests(Structure, initArgs),
  };
};

export const staticTests = <T, N extends Node<T>>(options: {
  length: number;
  name: string;
  Structure: Constructor<DataStructure<T, N>>;
}): TestSuite => ({ ...commonStaticTests(options) });
