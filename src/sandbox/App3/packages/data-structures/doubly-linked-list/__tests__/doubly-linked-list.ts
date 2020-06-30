import { makeTestSuite } from "../../../testsuite";
import { DoublyLinkedList } from "../doubly-linked-list";
import { tests, staticTests } from "../../__testHelpers__/testsuites";
import { withSize } from "../../with-size";

const initArgs = [1, 2, 3, 4, 5, 6, 7];

makeTestSuite(
  DoublyLinkedList,
  tests(DoublyLinkedList, initArgs),
  staticTests({
    length: 0,
    name: "DoublyLinkedList",
    Structure: DoublyLinkedList,
  })
);

const SizedDoublyLinkedList = withSize(DoublyLinkedList);

makeTestSuite(
  SizedDoublyLinkedList,
  tests(SizedDoublyLinkedList, initArgs),
  staticTests({
    length: 0,
    name: "SizedDoublyLinkedList",
    Structure: SizedDoublyLinkedList,
  })
);
