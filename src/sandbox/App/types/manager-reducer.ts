import { Payload } from "./item";
import { Selections } from "./selections";
import { ManagerAnswerAction } from "./actions";
import { VisibilityFilter } from "./visibility-filter";

export type ManagerState<T> = {
  items: Map<string, Payload<T>>;
  selections: Map<string, Selections>;
  visibilityFilter: VisibilityFilter;
};

export type ManagerReducer<T> = (
  state?: ManagerState<T>,
  action?: ManagerAnswerAction<T>
) => ManagerState<T>;
