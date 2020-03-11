import { List } from "../../../../core";
import { makeListComponents } from "../ListFactory";

const { StatefulList } = makeListComponents(
  List,
  {
    ui: { addItem: true },
    listItemUI: { deleteButton: true }
  },
  "Input"
);

export const PersistentInputList = StatefulList;

export default PersistentInputList;
