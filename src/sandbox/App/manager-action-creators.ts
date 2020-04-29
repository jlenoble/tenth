import { DropResult } from "react-beautiful-dnd";
import {
  Payload,
  PersistedItem,
  PayloadMap,
  PersistedItemMap,
  SelectionMap
} from "./types";
import { ManagerConsts } from "./manager-constants";

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

export type ReadyAction<T> = {
  type: ManagerConsts["READY"];
};

export type ManagerAction<T> =
  | CreateAction<T>
  | DestroyAction<T>
  | ModifyAction<T>
  | SetAction<T>
  | ClearAction<T>
  | MoveAction<T>
  | DoCreateAction<T>
  | DoDestroyAction<T>
  | DoModifyAction<T>
  | DoSetAction<T>
  | DoClearAction<T>
  | ReadyAction<T>
  | DoMoveAction<T>;

export type ManagerDoAction<T> =
  | DoCreateAction<T>
  | DoDestroyAction<T>
  | DoModifyAction<T>
  | DoSetAction<T>
  | DoClearAction<T>
  | DoMoveAction<T>;

export type ActionCreatorMap<T> = {
  create: (payload: PersistedItem<T>) => ManagerAction<T>;
  destroy: (itemId: string) => ManagerAction<T>;
  modify: (itemId: string, payload: PersistedItem<T>) => ManagerAction<T>;
  set: (payload: {
    items: PersistedItemMap<T>;
    selections: SelectionMap;
  }) => ManagerAction<T>;
  clear: () => ManagerAction<T>;
  move: (itemId: string, payload: DropResult) => ManagerAction<T>;

  doCreate: (itemId: string, payload: Payload<T>) => ManagerAction<T>;
  doDestroy: (itemId: string) => ManagerAction<T>;
  doModify: (itemId: string, payload: Payload<T>) => ManagerAction<T>;
  doSet: (payload: {
    items: PayloadMap<T>;
    selections: SelectionMap;
  }) => ManagerAction<T>;
  doClear: () => ManagerAction<T>;
  doMove: (itemId: string, payload: DropResult) => ManagerAction<T>;

  ready: () => ManagerAction<T>;
};

export const makeManagerActionCreators = <T>(
  CONSTS: ManagerConsts
): ActionCreatorMap<T> => {
  const {
    CREATE,
    DESTROY,
    MODIFY,
    SET,
    CLEAR,
    MOVE,

    DO_CREATE,
    DO_DESTROY,
    DO_MODIFY,
    DO_SET,
    DO_CLEAR,
    DO_MOVE,

    READY
  } = CONSTS;

  const create = (payload: PersistedItem<T>): ManagerAction<T> => ({
    type: CREATE,
    payload
  });

  const destroy = (itemId: string): ManagerAction<T> => ({
    type: DESTROY,
    itemId
  });

  const modify = (
    itemId: string,
    payload: PersistedItem<T>
  ): ManagerAction<T> => ({
    type: MODIFY,
    itemId,
    payload
  });

  const set = (payload: {
    items: PersistedItemMap<T>;
    selections: SelectionMap;
  }): ManagerAction<T> => ({
    type: SET,
    payload
  });

  const clear = (): ManagerAction<T> => ({
    type: CLEAR
  });

  const move = (itemId: string, payload: DropResult): ManagerAction<T> => {
    return {
      type: MOVE,
      itemId,
      payload
    };
  };

  const doCreate = (itemId: string, payload: Payload<T>): ManagerAction<T> => ({
    type: DO_CREATE,
    itemId,
    payload
  });

  const doDestroy = (itemId: string): ManagerAction<T> => ({
    type: DO_DESTROY,
    itemId
  });

  const doModify = (itemId: string, payload: Payload<T>): ManagerAction<T> => ({
    type: DO_MODIFY,
    itemId,
    payload
  });

  const doSet = (payload: {
    items: PayloadMap<T>;
    selections: SelectionMap;
  }): ManagerAction<T> => ({
    type: DO_SET,
    payload
  });

  const doClear = (): ManagerAction<T> => ({
    type: DO_CLEAR
  });

  const doMove = (itemId: string, payload: DropResult): ManagerAction<T> => {
    return {
      type: DO_MOVE,
      itemId,
      payload
    };
  };

  const ready = (): ManagerAction<T> => ({
    type: READY
  });

  return {
    create,
    destroy,
    modify,
    set,
    clear,
    move,

    doCreate,
    doDestroy,
    doModify,
    doSet,
    doClear,
    doMove,

    ready
  };
};
