import tmpId from "../defaultTmpId";
import { List } from "../../core";
import { makeListComponents } from "../ListFactory";

const { PureList, StatefulList } = makeListComponents(List, {
  tmpId,
  ui: { addItem: true },
  listItemUI: { checkbox: true, deleteButton: true }
});

export default PureList;

export const InputList = PureList;
export const StatefulInputList = StatefulList;
