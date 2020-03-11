import { SortList, StatefulSortList } from "..";
import instantiateTestSuite from "../../__testsuites__/instantiate";
import sortTestSuite from "../../__testsuites__/sort";

instantiateTestSuite(SortList, StatefulSortList);
sortTestSuite(SortList, StatefulSortList);
