import { List } from "../../../core";
import { makeListComponents } from "../ListFactory";

const { StatelessList, StatefulList } = makeListComponents(
  List,
  {
    ui: { editableText: true }
  },
  "Edit"
);

export default StatelessList;

export const EditList = StatelessList;
export const StatefulEditList = StatefulList;
