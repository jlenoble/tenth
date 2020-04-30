import { DropResult } from "react-beautiful-dnd";
import {
  Payload,
  PersistedItem,
  PayloadMap,
  PersistedItemMap,
  SelectionMap,
  ManagerConsts,
  ManagerAction
} from "./types";

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
