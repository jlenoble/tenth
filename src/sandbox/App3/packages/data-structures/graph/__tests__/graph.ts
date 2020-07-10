import { makeTestSuite } from "../../../testsuite";
import { Graph } from "../graph";
import { staticTests } from "../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../__testHelpers__/testsuites/graph";

const initArgs = [1, 10, 12, 5, 12, 2, 12, 33, 21];

makeTestSuite(
  Graph,
  tests(Graph, initArgs),
  staticTests({
    length: 1,
    name: "Graph",
    Structure: Graph,
  })
);
