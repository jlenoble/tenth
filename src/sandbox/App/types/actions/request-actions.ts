import { DropResult } from "react-beautiful-dnd";
import { PersistedItem, PersistedItemMap } from "../item";
import { SelectionMap } from "../selections";
import { ManagerConsts } from "../manager-consts";
import { VisibilityFilter } from "../visibility-filter";

export type CreateAction<T> = {
  type: ManagerConsts["CREATE"];
  payload: PersistedItem<T>;
};

export type DestroyAction = {
  type: ManagerConsts["DESTROY"];
  itemId: string;
};

export type ModifyAction<T> = {
  type: ManagerConsts["MODIFY"];
  itemId: string;
  payload: PersistedItem<T>;
};

export type SetAction<T> = {
  type: ManagerConsts["SET"];
  payload: { items: PersistedItemMap<T>; selections: SelectionMap };
};

export type ClearAction = {
  type: ManagerConsts["CLEAR"];
};

export type MoveAction = {
  type: ManagerConsts["MOVE"];
  itemId: string;
  payload: DropResult;
};

export type SetVisibilityFilterAction = {
  type: ManagerConsts["SET_VISIBILITY_FILTER"];
  visibilityFilter: VisibilityFilter;
};

export type ManagerRequestAction<T> =
  | CreateAction<T>
  | DestroyAction
  | ModifyAction<T>
  | SetAction<T>
  | ClearAction
  | MoveAction
  | SetVisibilityFilterAction;
