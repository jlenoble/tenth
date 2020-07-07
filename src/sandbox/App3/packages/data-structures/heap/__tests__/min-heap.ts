import { makeTestSuite } from "../../../testsuite";
import { MinHeap } from "../min-heap";
import { staticTests } from "../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../__testHelpers__/testsuites/heap";

const initArgs = [1, -2, 3, -4, 5, -6, 7];

makeTestSuite(
  MinHeap,
  tests(MinHeap, initArgs),
  staticTests({
    length: 0,
    name: "MinHeap",
    Structure: MinHeap,
  })
);
