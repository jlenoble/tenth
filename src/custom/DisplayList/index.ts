import { List } from "../../core";
import { makeListComponents } from "../ListFactory";
import tmpId from "../defaultTmpId";

const { PureList, StatefulList } = makeListComponents(List, { tmpId });

export default PureList;

export const DisplayList = PureList;
export const StatefulDisplayList = StatefulList;
