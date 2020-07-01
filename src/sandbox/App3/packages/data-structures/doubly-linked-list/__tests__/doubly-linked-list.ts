import { makeTestSuite } from "../../../testsuite";
import { DoublyLinkedList } from "../doubly-linked-list";
import { tests, staticTests } from "../../__testHelpers__/testsuites";
import { withSize } from "../../linked-list/with-size";

const initArgs = [1, 2, 3, 4, 5, 6, 7];

makeTestSuite(
  DoublyLinkedList,
  tests(DoublyLinkedList, initArgs, { linkedList: true }),
  staticTests({
    length: 1,
    name: "DoublyLinkedList",
    Structure: DoublyLinkedList,
  })
);

const SizedDoublyLinkedList = withSize(DoublyLinkedList);

makeTestSuite(
  SizedDoublyLinkedList,
  tests(SizedDoublyLinkedList, initArgs, { linkedList: true }),
  staticTests({
    length: 1,
    name: "SizedDoublyLinkedList",
    Structure: SizedDoublyLinkedList,
  })
);
