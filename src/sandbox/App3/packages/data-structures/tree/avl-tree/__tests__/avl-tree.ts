import { makeTestSuite } from "../../../../testsuite";
import { AvlTree } from "../avl-tree";
import { staticTests } from "../../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../../__testHelpers__/testsuites/avl-tree";

const initArgs = [1, 10, 12, 5, 12, 2, 12, 33, 21];
const balancedArgs: number[] = [
  16,
  8,
  24,
  4,
  20,
  12,
  28,
  2,
  18,
  10,
  26,
  6,
  22,
  14,
  30,
  1,
  17,
  9,
  25,
  5,
  21,
  13,
  29,
  3,
  19,
  11,
  27,
  7,
  23,
  15,
  31,
];

makeTestSuite(
  AvlTree,
  tests(AvlTree, initArgs, balancedArgs),
  staticTests({
    length: 1,
    name: "AvlTree",
    Structure: AvlTree,
  })
);
