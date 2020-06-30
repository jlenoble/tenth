import { makeTestSuite } from "../../../testsuite";
import { DoublyLinkedList } from "../doubly-linked-list";
import { SizedDoublyLinkedList } from "../sized-doubly-linked-list";
import { tests, staticTests } from "../../__testHelpers__/testsuites";

const initArgs = [1, 2, 3, 2, 1, 5, 4];

makeTestSuite(
  DoublyLinkedList,
  tests(DoublyLinkedList, initArgs),
  staticTests({
    length: 0,
    name: "DoublyLinkedList",
    Structure: DoublyLinkedList,
  })
);

makeTestSuite(
  SizedDoublyLinkedList,
  tests(SizedDoublyLinkedList, initArgs),
  staticTests({
    length: 0,
    name: "SizedDoublyLinkedList",
    Structure: SizedDoublyLinkedList,
  })
);
