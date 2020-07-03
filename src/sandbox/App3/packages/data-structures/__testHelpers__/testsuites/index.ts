import { TestSuite } from "../../../testsuite";
import { DataStructure, Constructor } from "../../types";
import { staticTests as commonStaticTests } from "./common";

export { tests as linkedListTests } from "./linked-list";
export { tests as stackTests } from "./stack";
export { tests as queueTests } from "./queue";
export { tests as heapTests } from "./heap";
export { tests as priorityQueueTests } from "./priority-queue";

export const staticTests = <T>(options: {
  length: number;
  name: string;
  Structure: Constructor<DataStructure<T>>;
}): TestSuite => ({ ...commonStaticTests(options) });
