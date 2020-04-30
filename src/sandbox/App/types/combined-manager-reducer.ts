import { Action } from "redux";
import { ManagerState, ManagerReducer } from "./manager-reducer";

export type MutableCombinedState = { [managerId: string]: ManagerState<any> };
export type CombinedState = Readonly<MutableCombinedState>;

export type MutableReducerMap<T> = { [managerId: string]: ManagerReducer<T> };

export type CombinedReducer = (
  state?: CombinedState,
  action?: Action
) => CombinedState;
