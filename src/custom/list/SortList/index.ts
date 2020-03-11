import { List } from "../../../core";
import { makeListComponents } from "./ListFactory";

const { StatelessList, StatefulList } = makeListComponents(List, {});

export default StatelessList;

export const SortList = StatelessList;
export const StatefulSortList = StatefulList;
