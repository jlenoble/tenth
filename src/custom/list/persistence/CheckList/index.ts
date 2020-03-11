import { List } from "../../../../core";
import { makeListComponents } from "../ListFactory";

const { StatefulList } = makeListComponents(
  List,
  {
    listItemUI: { checkbox: true }
  },
  "Check"
);

export const PersistentCheckList = StatefulList;

export default PersistentCheckList;
