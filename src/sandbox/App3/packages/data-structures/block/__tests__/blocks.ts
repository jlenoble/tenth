import { makeTestSuite } from "../../../testsuite";
import { Blocks } from "../blocks";
import { staticTests } from "../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../__testHelpers__/testsuites/blocks";

const initArgs = [1, 10, 12, 5, 12, 2, 12, 33, 21].map((arg) => ({
  value: "a" + arg,
  width: arg,
}));

makeTestSuite(
  Blocks,
  tests(
    Blocks,
    initArgs,
    (arg: { value: string; width: number }) => arg.width,
    20
  ),
  staticTests({
    length: 1,
    name: "Blocks",
    Structure: Blocks,
  })
);
