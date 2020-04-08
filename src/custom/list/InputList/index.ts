import { List } from "../../../core";
import { makeListComponents } from "../ListFactory";

const { StatelessList, StatefulList } = makeListComponents(
  List,
  {
    ui: { addItem: true, deleteButton: true }
  },
  "Input"
);

export default StatelessList;

export const InputList = StatelessList;
export const StatefulInputList = StatefulList;
