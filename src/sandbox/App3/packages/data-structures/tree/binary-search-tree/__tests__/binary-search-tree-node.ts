import { makeTestSuite } from "../../../../testsuite";
import { BinarySearchTreeNode } from "../binary-search-tree-node";
import {
  tests,
  staticTests,
} from "../../../__testHelpers__/testsuites/binary-search-tree-node";

makeTestSuite(
  BinarySearchTreeNode,
  tests(BinarySearchTreeNode),
  staticTests({
    length: 2,
    name: "BinarySearchTreeNode",
    Structure: BinarySearchTreeNode,
  })
);
