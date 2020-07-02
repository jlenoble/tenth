import { makeTestSuite } from "../../../testsuite";
import { MaxHeap } from "../max-heap";
import { heapTests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, -2, 3, -4, 5, -6, 7];

makeTestSuite(
  MaxHeap,
  heapTests(MaxHeap, initArgs),
  staticTests({
    length: 0,
    name: "MaxHeap",
    Structure: MaxHeap,
  })
);
