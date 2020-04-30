import { DropResult } from "react-beautiful-dnd";
import { PayloadMap, Payload } from "../item";
import { SelectionMap } from "../selections";
import { ManagerConsts } from "../manager-consts";

export type DoCreateAction<T> = {
  type: ManagerConsts["DO_CREATE"];
  itemId: string;
  payload: Payload<T>;
};

export type DoDestroyAction<T> = {
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

export type DoClearAction<T> = {
  type: ManagerConsts["DO_CLEAR"];
};

export type DoMoveAction<T> = {
  type: ManagerConsts["DO_MOVE"];
  itemId: string;
  payload: DropResult;
};

export type ManagerAnswerAction<T> =
  | DoCreateAction<T>
  | DoDestroyAction<T>
  | DoModifyAction<T>
  | DoSetAction<T>
  | DoClearAction<T>
  | DoMoveAction<T>;
