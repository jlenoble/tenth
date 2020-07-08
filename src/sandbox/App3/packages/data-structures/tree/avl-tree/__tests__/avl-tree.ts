import { makeTestSuite } from "../../../../testsuite";
import { AvlTree } from "../avl-tree";
import { staticTests } from "../../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../../__testHelpers__/testsuites/avl-tree";

const initArgs = [1, 10, 12, 5, 12, 2, 12, 33, 21];

makeTestSuite(
  AvlTree,
  tests(AvlTree, initArgs),
  staticTests({
    length: 1,
    name: "AvlTree",
    Structure: AvlTree,
  })
);
