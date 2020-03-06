import { CheckList, StatefulCheckList } from "..";
import instantiateTestSuite from "../../__testsuites__/instantiate";
import checkTestSuite from "../../__testsuites__/check";

instantiateTestSuite(CheckList, StatefulCheckList);
checkTestSuite(CheckList, StatefulCheckList);
