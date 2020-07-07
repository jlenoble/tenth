import { makeTestSuite } from "../../../testsuite";
import { BinaryTreeNode } from "../binary-tree-node";
import { binaryTreeNodeTests } from "../../__testHelpers__/testsuites";
import { staticTests } from "../../__testHelpers__/testsuites/binary-tree-node";

makeTestSuite(
  BinaryTreeNode,
  binaryTreeNodeTests(BinaryTreeNode),
  staticTests({ length: 2, name: "BinaryTreeNode", Structure: BinaryTreeNode })
);
