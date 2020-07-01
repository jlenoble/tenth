import { makeTestSuite } from "../../../testsuite";
import { Stack } from "../stack";
import { stackTests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, 2, 3, 4, 5, 6, 7];

makeTestSuite(
  Stack,
  stackTests(Stack, initArgs),
  staticTests({ length: 1, name: "Stack", Structure: Stack })
);
