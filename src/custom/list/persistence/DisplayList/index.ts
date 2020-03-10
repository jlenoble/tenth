import { List } from "../../../../core";
import { makeListComponents } from "../ListFactory";

const { StatefulList } = makeListComponents(List, {}, "PersistentDisplay");

export const PersistentDisplayList = StatefulList;

export default PersistentDisplayList;
