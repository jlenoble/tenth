import { makeTestSuite } from "../../../testsuite";
import { Graph } from "../graph";
import { staticTests } from "../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../__testHelpers__/testsuites/digraph";

const initArgs = [1, 10, 12, 5, 12, 2, 12, 33, 21];

class DirectedGraph extends Graph<number> {
  constructor(values?: Iterable<number>) {
    super(values, true);
  }
}

makeTestSuite(
  DirectedGraph,
  tests(DirectedGraph, initArgs),
  staticTests({
    length: 1,
    name: "DirectedGraph",
    Structure: DirectedGraph,
  })
);
