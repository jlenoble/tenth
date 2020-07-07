import { makeTestSuite } from "../../../testsuite";
import { Queue } from "../queue";
import { staticTests } from "../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../__testHelpers__/testsuites/queue";

const initArgs = [1, 2, 3, 4, 5, 6, 7];

makeTestSuite(
  Queue,
  tests(Queue, initArgs),
  staticTests({ length: 1, name: "Queue", Structure: Queue })
);
