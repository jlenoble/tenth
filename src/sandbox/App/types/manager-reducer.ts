import { Payload } from "./item";
import { Selections } from "./selections";
import { ManagerDoAction } from "../manager-action-creators";

export type ManagerState<T> = {
  items: Map<string, Payload<T>>;
  selections: Map<string, Selections>;
};

export type ManagerReducer<T> = (
  state?: ManagerState<T>,
  action?: ManagerDoAction<T>
) => ManagerState<T>;
