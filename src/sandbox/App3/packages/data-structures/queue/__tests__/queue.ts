import { makeTestSuite } from "../../../testsuite";
import { Queue } from "../queue";
import { queueTests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, 2, 3, 4, 5, 6, 7];

makeTestSuite(
  Queue,
  queueTests(Queue, initArgs),
  staticTests({ length: 1, name: "Queue", Structure: Queue })
);
