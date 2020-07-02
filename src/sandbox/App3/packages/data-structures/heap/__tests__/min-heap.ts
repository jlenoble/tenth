import { makeTestSuite } from "../../../testsuite";
import { MinHeap } from "../min-heap";
import { heapTests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, -2, 3, -4, 5, -6, 7];

makeTestSuite(
  MinHeap,
  heapTests(MinHeap, initArgs),
  staticTests({
    length: 0,
    name: "MinHeap",
    Structure: MinHeap,
  })
);
