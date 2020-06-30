import { makeTestSuite } from "../../../testsuite";
import { LinkedList } from "../linked-list";
import { tests, staticTests } from "../../__testHelpers__/testsuites";
import { withSize } from "../../with-size";

const initArgs = [1, 2, 3, 4, 5, 6, 7];

makeTestSuite(
  LinkedList,
  tests(LinkedList, initArgs),
  staticTests({ length: 0, name: "LinkedList", Structure: LinkedList })
);

const SizedLinkedList = withSize(LinkedList);

makeTestSuite(
  SizedLinkedList,
  tests(SizedLinkedList, initArgs),
  staticTests({
    length: 0,
    name: "SizedLinkedList",
    Structure: SizedLinkedList,
  })
);
