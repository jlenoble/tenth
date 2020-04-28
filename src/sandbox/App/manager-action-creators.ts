import { ManagerConsts } from "./manager-constants";

type CreateAction<T> = {
  type: ManagerConsts["CREATE"];
  payload?: T;
};

type DestroyAction<T> = {
  type: ManagerConsts["DESTROY"];
  itemId: string;
};

type ModifyAction<T> = {
  type: ManagerConsts["MODIFY"];
  itemId: string;
  payload: T;
};

type DoCreateAction<T> = {
  type: ManagerConsts["DO_CREATE"];
  itemId: string;
  payload: T;
};

type DoDestroyAction<T> = {
  type: ManagerConsts["DO_DESTROY"];
  itemId: string;
};

type DoModifyAction<T> = {
  type: ManagerConsts["DO_MODIFY"];
  itemId: string;
  payload: T;
};

type ManagerAction<T> =
  | CreateAction<T>
  | DestroyAction<T>
  | ModifyAction<T>
  | DoCreateAction<T>
  | DoDestroyAction<T>
  | DoModifyAction<T>;

export type ManagerDoAction<T> =
  | DoCreateAction<T>
  | DoDestroyAction<T>
  | DoModifyAction<T>;

export const makeManagerActionCreators = <T>(CONSTS: ManagerConsts) => {
  const { CREATE, DESTROY, MODIFY, DO_CREATE, DO_DESTROY, DO_MODIFY } = CONSTS;

  const create = (payload?: T): ManagerAction<T> => ({
    type: CREATE,
    payload
  });

  const destroy = (itemId: string): ManagerAction<T> => ({
    type: DESTROY,
    itemId
  });

  const modify = (itemId: string, payload: T): ManagerAction<T> => ({
    type: MODIFY,
    itemId,
    payload
  });

  const doCreate = (itemId: string, payload: T): ManagerAction<T> => ({
    type: DO_CREATE,
    itemId,
    payload
  });

  const doDestroy = (itemId: string): ManagerAction<T> => ({
    type: DO_DESTROY,
    itemId
  });

  const doModify = (itemId: string, payload: T): ManagerAction<T> => ({
    type: DO_MODIFY,
    itemId,
    payload
  });

  return { create, destroy, modify, doCreate, doDestroy, doModify };
};
