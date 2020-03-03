import { List, Props, UI } from "./List";
import { withItems } from "./stateful";

export type ListProps = Props;
export type ListUI = UI;

export default List;
export { List };

export * from "./hooks";
export * from "./item";

const StatefulList = withItems(List);

export { StatefulList, withItems };
