import { makeTestSuite } from "../../../testsuite";
import { Queue } from "../queue";
import { tests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, 2, 3, 2, 1, 5, 4];

makeTestSuite(
  Queue,
  tests(Queue, initArgs, { fifo: true }),
  staticTests({ length: 0, name: "Queue", Structure: Queue })
);
