import { makeTestSuite } from "../../../testsuite";
import { LinkedList } from "../linked-list";
import { linkedListTests, staticTests } from "../../__testHelpers__/testsuites";
import { withSize } from "../with-size";

const initArgs = [1, 2, 3, 4, 5, 6, 7];

makeTestSuite(
  LinkedList,
  linkedListTests(LinkedList, initArgs),
  staticTests({ length: 1, name: "LinkedList", Structure: LinkedList })
);

const SizedLinkedList = withSize(LinkedList);

makeTestSuite(
  SizedLinkedList,
  linkedListTests(SizedLinkedList, initArgs),
  staticTests({
    length: 1,
    name: "SizedLinkedList",
    Structure: SizedLinkedList,
  })
);
