import { Action } from "redux";

export type Item<T> = Readonly<{
  managerId: string;
  itemId: string;
  payload: T;
}>;
export type Validator<T> = (payload: T) => readonly string[];

export type ManagerState<T> = Map<
  string,
  Readonly<{ itemId: string; payload: T }>
>;
export type MutableCombinedState = { [managerId: string]: ManagerState<any> };
export type CombinedState = Readonly<MutableCombinedState>;

export type Reducer<T> = (
  state?: ManagerState<T>,
  action?: Action & Item<T>
) => ManagerState<T>;
