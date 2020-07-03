import { makeTestSuite } from "../../../testsuite";
import { PriorityQueue } from "../priority-queue";
import {
  priorityQueueTests,
  staticTests,
} from "../../__testHelpers__/testsuites";

const initArgs: [{ a: number }, number][] = [
  [{ a: 1 }, 0],
  [{ a: 2 }, 10],
  [{ a: 3 }, 40],
  [{ a: 4 }, 20],
  [{ a: 5 }, 0],
  [{ a: 6 }, 20],
  [{ a: 7 }, 20],
  [{ a: 8 }, 10],
];

makeTestSuite(
  PriorityQueue,
  priorityQueueTests(PriorityQueue, initArgs, {
    getValue: ([value]: [{ a: number }, number]) => value,
    getPriority: ([, priority]: [{ a: number }, number]) => priority,
  }),
  staticTests({
    length: 1,
    name: "PriorityQueue",
    Structure: PriorityQueue,
  })
);
