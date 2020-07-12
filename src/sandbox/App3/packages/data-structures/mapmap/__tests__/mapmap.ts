import { makeTestSuite } from "../../../testsuite";
import { MapMap } from "../mapmap";
import { staticTests } from "../../__testHelpers__/testsuites/data-structure";
import { tests } from "../../__testHelpers__/testsuites/mapmap";

const initArgs = [1, 10, 12, 5, 12, 2, 12, 33, 21];

makeTestSuite(
  MapMap,
  tests(MapMap, initArgs),
  staticTests({
    length: 0,
    name: "MapMap",
    Structure: MapMap,
  })
);
