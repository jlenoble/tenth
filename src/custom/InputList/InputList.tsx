import { List } from "../../core";
import { makeListComponents } from "../ListFactory";

const { PureList, StatefulList } = makeListComponents(
  List,
  {
    ui: { addItem: true },
    listItemUI: { checkbox: true, deleteButton: true }
  },
  "Input"
);

export default PureList;

export const InputList = PureList;
export const StatefulInputList = StatefulList;
