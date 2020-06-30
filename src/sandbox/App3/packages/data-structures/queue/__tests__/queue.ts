import { makeTestSuite } from "../../../testsuite";
import { Queue } from "../queue";
import { tests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, 2, 3, 4, 5, 6, 7];

makeTestSuite(
  Queue,
  tests(Queue, initArgs, { fifo: true }),
  staticTests({ length: 0, name: "Queue", Structure: Queue })
);
