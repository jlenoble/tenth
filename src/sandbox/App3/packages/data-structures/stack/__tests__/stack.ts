import { makeTestSuite } from "../../../testsuite";
import { Stack } from "../stack";
import { staticTests } from "../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../__testHelpers__/testsuites/stack";

const initArgs = [1, 2, 3, 4, 5, 6, 7];

makeTestSuite(
  Stack,
  tests(Stack, initArgs),
  staticTests({ length: 1, name: "Stack", Structure: Stack })
);
