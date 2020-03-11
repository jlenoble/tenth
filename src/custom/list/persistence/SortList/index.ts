import { List } from "../../../../core";
import { makeListComponents } from "../ListFactory";
import { withDnD } from "../../SortList/ListFactory";

const { StatefulList } = makeListComponents(withDnD(List), {});

export const PersistentSortList = StatefulList;

export default PersistentSortList;
