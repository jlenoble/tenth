import { makeTestSuite } from "../../../testsuite";
import { GraphEdge } from "../graph-edge";
import {
  tests,
  staticTests,
} from "../../__testHelpers__/testsuites/graph-edge";

const initArgs = [1, 10, 12, 5, 12, 2, 12, 33, 21];

makeTestSuite(
  GraphEdge,
  tests(GraphEdge, initArgs),
  staticTests({
    length: 2,
    name: "GraphEdge",
    Structure: GraphEdge,
  })
);
