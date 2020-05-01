import { DropResult } from "react-beautiful-dnd";
import { PayloadMap, Payload } from "../item";
import { SelectionMap } from "../selections";
import { ManagerConsts } from "../manager-consts";
import { VisibilityFilter } from "../visibility-filter";

export type DoCreateAction<T> = {
  type: ManagerConsts["DO_CREATE"];
  itemId: string;
  payload: Payload<T>;
};

export type DoDestroyAction = {
  type: ManagerConsts["DO_DESTROY"];
  itemId: string;
};

export type DoModifyAction<T> = {
  type: ManagerConsts["DO_MODIFY"];
  itemId: string;
  payload: Payload<T>;
};

export type DoSetAction<T> = {
  type: ManagerConsts["DO_SET"];
  payload: { items: PayloadMap<T>; selections: SelectionMap };
};

export type DoClearAction = {
  type: ManagerConsts["DO_CLEAR"];
};

export type DoMoveAction = {
  type: ManagerConsts["DO_MOVE"];
  itemId: string;
  payload: DropResult;
};

export type DoSetVisibilityFilterAction = {
  type: ManagerConsts["DO_SET_VISIBILITY_FILTER"];
  visibilityFilter: VisibilityFilter;
};

export type ManagerAnswerAction<T> =
  | DoCreateAction<T>
  | DoDestroyAction
  | DoModifyAction<T>
  | DoSetAction<T>
  | DoClearAction
  | DoMoveAction
  | DoSetVisibilityFilterAction;
