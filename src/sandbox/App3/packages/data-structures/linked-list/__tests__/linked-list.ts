import { makeTestSuite } from "../../../testsuite";
import { LinkedList } from "../linked-list";
import { SizedLinkedList } from "../sized-linked-list";
import { tests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, 2, 3, 2, 1, 5, 4];

makeTestSuite(
  LinkedList,
  tests(LinkedList, initArgs),
  staticTests({ length: 0, name: "LinkedList", Structure: LinkedList })
);

makeTestSuite(
  SizedLinkedList,
  tests(SizedLinkedList, initArgs),
  staticTests({
    length: 0,
    name: "SizedLinkedList",
    Structure: SizedLinkedList,
  })
);
