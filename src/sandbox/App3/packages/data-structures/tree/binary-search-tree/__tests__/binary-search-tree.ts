import { makeTestSuite } from "../../../../testsuite";
import { BinarySearchTree } from "../binary-search-tree";
import {
  binarySearchTreeTests,
  staticTests,
} from "../../../__testHelpers__/testsuites";

const initArgs = [1, 10, 12, 5, 12, 12, 33, 21];

makeTestSuite(
  BinarySearchTree,
  binarySearchTreeTests(BinarySearchTree, initArgs),
  staticTests({
    length: 1,
    name: "BinarySearchTree",
    Structure: BinarySearchTree,
  })
);
