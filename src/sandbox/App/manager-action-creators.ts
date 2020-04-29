import { PayloadMap, PersistedItemMap, Payload, PersistedItem } from "./types";
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
  payload: PersistedItemMap<T>;
};

export type ClearAction<T> = {
  type: ManagerConsts["CLEAR"];
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
  payload: PayloadMap<T>;
};

export type DoClearAction<T> = {
  type: ManagerConsts["DO_CLEAR"];
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
  | DoCreateAction<T>
  | DoDestroyAction<T>
  | DoModifyAction<T>
  | DoSetAction<T>
  | DoClearAction<T>
  | ReadyAction<T>;

export type ManagerDoAction<T> =
  | DoCreateAction<T>
  | DoDestroyAction<T>
  | DoModifyAction<T>
  | DoSetAction<T>
  | DoClearAction<T>;

export type ActionCreatorMap<T> = {
  create: (payload: PersistedItem<T>) => ManagerAction<T>;
  destroy: (itemId: string) => ManagerAction<T>;
  modify: (itemId: string, payload: PersistedItem<T>) => ManagerAction<T>;
  set: (payload: PersistedItemMap<T>) => ManagerAction<T>;
  clear: () => ManagerAction<T>;

  doCreate: (itemId: string, payload: Payload<T>) => ManagerAction<T>;
  doDestroy: (itemId: string) => ManagerAction<T>;
  doModify: (itemId: string, payload: Payload<T>) => ManagerAction<T>;
  doSet: (payload: PayloadMap<T>) => ManagerAction<T>;
  doClear: () => ManagerAction<T>;

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

    DO_CREATE,
    DO_DESTROY,
    DO_MODIFY,
    DO_SET,
    DO_CLEAR,

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

  const set = (payload: PersistedItemMap<T>): ManagerAction<T> => ({
    type: SET,
    payload
  });

  const clear = (): ManagerAction<T> => ({
    type: CLEAR
  });

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

  const doSet = (payload: PayloadMap<T>): ManagerAction<T> => ({
    type: DO_SET,
    payload
  });

  const doClear = (): ManagerAction<T> => ({
    type: DO_CLEAR
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

    doCreate,
    doDestroy,
    doModify,
    doSet,
    doClear,

    ready
  };
};
