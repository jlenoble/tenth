import { makeTestSuite } from "../../../testsuite";
import { BinaryTreeNode } from "../binary-tree-node";
import {
  tests,
  staticTests,
} from "../../__testHelpers__/testsuites/binary-tree-node";

makeTestSuite(
  BinaryTreeNode,
  tests(BinaryTreeNode),
  staticTests({ length: 1, name: "BinaryTreeNode", Structure: BinaryTreeNode })
);
