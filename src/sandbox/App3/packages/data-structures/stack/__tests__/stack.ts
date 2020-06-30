import { makeTestSuite } from "../../../testsuite";
import { Stack } from "../stack";
import { tests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, 2, 3, 2, 1, 5, 4];

makeTestSuite(
  Stack,
  tests(Stack, initArgs),
  staticTests({ length: 0, name: "Stack", Structure: Stack })
);
