import { List } from "../../../core";
import { makeListComponents } from "../ListFactory";

const { StatelessList, StatefulList } = makeListComponents(
  List,
  {
    listItemUI: { checkbox: true }
  },
  "Check"
);

export default StatelessList;

export const CheckList = StatelessList;
export const StatefulCheckList = StatefulList;