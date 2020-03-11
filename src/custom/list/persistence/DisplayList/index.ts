import { List } from "../../../../core";
import { makeListComponents } from "../ListFactory";

const { StatefulList } = makeListComponents(List, {}, "Display");

export const PersistentDisplayList = StatefulList;

export default PersistentDisplayList;
