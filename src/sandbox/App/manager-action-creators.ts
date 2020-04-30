import { DropResult } from "react-beautiful-dnd";
import {
  Payload,
  PersistedItem,
  PayloadMap,
  PersistedItemMap,
  SelectionMap,
  ManagerConsts,
  ManagerAction,
  ActionCreatorMap,
  VisibilityFilter
} from "./types";

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

    SET_VISIBILITY_FILTER,
    DO_SET_VISIBILITY_FILTER,

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

  const setVisibilityFilter = (
    visibilityFilter: VisibilityFilter
  ): ManagerAction<T> => ({
    type: SET_VISIBILITY_FILTER,
    visibilityFilter
  });

  const doSetVisibilityFilter = (
    visibilityFilter: VisibilityFilter
  ): ManagerAction<T> => ({
    type: DO_SET_VISIBILITY_FILTER,
    visibilityFilter
  });

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

    setVisibilityFilter,
    doSetVisibilityFilter,

    ready
  };
};
