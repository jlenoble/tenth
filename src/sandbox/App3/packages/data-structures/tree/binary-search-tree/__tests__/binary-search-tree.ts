import { makeTestSuite } from "../../../../testsuite";
import { BinarySearchTree } from "../binary-search-tree";
import {
  binarySearchTreeTests,
  staticTests,
} from "../../../__testHelpers__/testsuites";

makeTestSuite(
  BinarySearchTree,
  binarySearchTreeTests(BinarySearchTree),
  staticTests({
    length: 1,
    name: "BinarySearchTree",
    Structure: BinarySearchTree,
  })
);
