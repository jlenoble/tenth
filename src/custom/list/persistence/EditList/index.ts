import { List } from "../../../../core";
import { makeListComponents } from "../ListFactory";

const { StatefulList } = makeListComponents(
  List,
  {
    listItemUI: { editableText: true }
  },
  "Edit"
);

export const PersistentEditList = StatefulList;

export default PersistentEditList;
