import { DropResult } from "react-beautiful-dnd";
import { PersistedItem, PersistedItemMap } from "../item";
import { SelectionMap } from "../selections";
import { ManagerConsts } from "../manager-consts";

export type CreateAction<T> = {
  type: ManagerConsts["CREATE"];
  payload: PersistedItem<T>;
};

export type DestroyAction<T> = {
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

export type ClearAction<T> = {
  type: ManagerConsts["CLEAR"];
};

export type MoveAction<T> = {
  type: ManagerConsts["MOVE"];
  itemId: string;
  payload: DropResult;
};

export type ManagerRequestAction<T> =
  | CreateAction<T>
  | DestroyAction<T>
  | ModifyAction<T>
  | SetAction<T>
  | ClearAction<T>
  | MoveAction<T>;
