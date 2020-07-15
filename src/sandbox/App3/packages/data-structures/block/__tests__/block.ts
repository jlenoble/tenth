import { makeTestSuite } from "../../../testsuite";
import { Block } from "../block";
import { staticTests } from "../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../__testHelpers__/testsuites/block";

const initArgs = [1, 10, 12, 5, 12, 2, 12, 33, 21];

makeTestSuite(
  Block,
  tests(Block, initArgs),
  staticTests({
    length: 1,
    name: "Block",
    Structure: Block,
  })
);
