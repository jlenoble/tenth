import { makeTestSuite } from "../../../testsuite";
import { GraphVertex } from "../graph-vertex";
import {
  tests,
  staticTests,
} from "../../__testHelpers__/testsuites/graph-vertex";

const initArgs = [1, 10, 12, 5, 12, 2, 12, 33, 21];

makeTestSuite(
  GraphVertex,
  tests(GraphVertex, initArgs),
  staticTests({
    length: 1,
    name: "GraphVertex",
    Structure: GraphVertex,
  })
);
