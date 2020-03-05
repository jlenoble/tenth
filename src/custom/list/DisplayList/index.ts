import { List } from "../../../core";
import { makeListComponents } from "../ListFactory";

const { StatelessList, StatefulList } = makeListComponents(List, {}, "Display");

export default StatelessList;

export const DisplayList = StatelessList;
export const StatefulDisplayList = StatefulList;
