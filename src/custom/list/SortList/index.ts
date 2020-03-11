import { List } from "../../../core";
import { makeListComponents } from "./ListFactory";

const { SortList } = makeListComponents(List, {});

export default SortList;

export { SortList };
