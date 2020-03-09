import { InputList, StatefulInputList } from "..";
import instantiateTestSuite from "../../__testsuites__/instantiate";
import addTestSuite from "../../__testsuites__/add";
import deleteTestSuite from "../../__testsuites__/delete";

instantiateTestSuite(InputList, StatefulInputList);
addTestSuite(InputList, StatefulInputList);
deleteTestSuite(InputList, StatefulInputList);
