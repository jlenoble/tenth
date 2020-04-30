import { Payload } from "./item";
import { Selections } from "./selections";
import { ManagerAnswerAction } from "./actions";

export type ManagerState<T> = {
  items: Map<string, Payload<T>>;
  selections: Map<string, Selections>;
};

export type ManagerReducer<T> = (
  state?: ManagerState<T>,
  action?: ManagerAnswerAction<T>
) => ManagerState<T>;
