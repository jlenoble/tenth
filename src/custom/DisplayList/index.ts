import { List } from "../../core";
import { makeListComponents } from "../ListFactory";

const { PureList, StatefulList } = makeListComponents(List, {}, "Display");

export default PureList;

export const DisplayList = PureList;
export const StatefulDisplayList = StatefulList;
