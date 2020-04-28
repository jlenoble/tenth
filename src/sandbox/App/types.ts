import { ManagerDoAction } from "./manager-action-creators";

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

export type ManagerReducer<T> = (
  state?: ManagerState<T>,
  action?: ManagerDoAction<T>
) => ManagerState<T>;
