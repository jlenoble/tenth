import { makeTestSuite } from "../../../testsuite";
import { BinaryTreeNode } from "../binary-tree-node";
import { binaryTreeNodeTests } from "../../__testHelpers__/testsuites";

makeTestSuite(BinaryTreeNode, binaryTreeNodeTests(BinaryTreeNode));
