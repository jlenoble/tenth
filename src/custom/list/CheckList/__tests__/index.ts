import { CheckList, StatefulCheckList } from "..";
import instantiateTestSuite from "../../DisplayList/__testsuites__/instantiate";
import checkTestSuite from "../__testsuites__";

instantiateTestSuite(CheckList, StatefulCheckList);
checkTestSuite(CheckList, StatefulCheckList);
