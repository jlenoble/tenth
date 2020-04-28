import { ManagerConsts } from "./manager-constants";

interface ManagerAction<T> {
  type: string;
  itemId?: string;
  payload?: Partial<T>;
}

export const makeManagerActionCreators = <T>(
  managerId: string,
  CONSTS: ManagerConsts
): { [key: string]: (...args: any[]) => ManagerAction<T> } => {
  const { CREATE, DESTROY, MODIFY, DO_CREATE, DO_DESTROY, DO_MODIFY } = CONSTS;

  const create = (payload?: Partial<T>) => ({
    type: CREATE,
    payload
  });

  const destroy = (itemId: string) => ({
    type: DESTROY,
    itemId
  });

  const modify = (itemId: string, payload: Partial<T>) => ({
    type: MODIFY,
    itemId,
    payload
  });

  const doCreate = (itemId: string, payload: Partial<T>) => ({
    type: DO_CREATE,
    itemId,
    payload
  });

  const doDestroy = (itemId: string) => ({
    type: DO_DESTROY,
    itemId
  });

  const doModify = (itemId: string, payload: Partial<T>) => ({
    type: DO_MODIFY,
    itemId,
    payload
  });

  return { create, destroy, modify, doCreate, doDestroy, doModify };
};
