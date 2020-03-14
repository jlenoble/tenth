import { EditList, StatefulEditList } from "..";
import instantiateTestSuite from "../../__testsuites__/instantiate";
import editTestSuite from "../../__testsuites__/edit";

instantiateTestSuite(EditList, StatefulEditList);
editTestSuite(EditList, StatefulEditList);
