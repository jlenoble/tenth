import { makeTestSuite } from "../../../../testsuite";
import { BinarySearchTree } from "../binary-search-tree";
import { staticTests } from "../../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../../__testHelpers__/testsuites/binary-search-tree";

const initArgs = [1, 10, 12, 5, 12, 12, 33, 21];

makeTestSuite(
  BinarySearchTree,
  tests(BinarySearchTree, initArgs),
  staticTests({
    length: 1,
    name: "BinarySearchTree",
    Structure: BinarySearchTree,
  })
);
