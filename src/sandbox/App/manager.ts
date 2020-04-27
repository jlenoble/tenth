import { Action } from "redux";
import { put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import { makeSagaManager, SagaManager } from "./saga-manager";

let counter = 0;

type Item<T> = Readonly<{ managerId: string; itemId: string; payload: T }>;

export type ManagerState<T> = Map<
  string,
  Readonly<{ itemId: string; payload: T }>
>;
export type MutableCombinedState<T> = { [managerId: string]: ManagerState<T> };
export type CombinedState<T> = Readonly<MutableCombinedState<T>>;

export type Reducer<T> = (
  state?: ManagerState<T>,
  action?: Action & Item<T>
) => ManagerState<T>;

export type Manager<T> = Readonly<{
  managerId: string;
  reducer: Reducer<T>;
  create: (payload?: T) => void;
  destroy: (id: string) => void;
  getState: (state: CombinedState<T>) => ManagerState<T>;
  sagaManager: SagaManager;
  addMappedChild: <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: U) => T,
    adaptFromParentToChild: (payload: T) => U
  ) => Manager<U>;
  addFilteredChild: <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: U) => T,
    adaptFromParentToChild: (payload: T) => U
  ) => Manager<U>;
  getChildren: () => readonly Manager<any>[];
}>;

export const makeManager = <T>(
  managerId: string,
  parentManagerId?: string
): Manager<T> => {
  const CREATE = managerId + "_CREATE";
  const DESTROY = managerId + "_DESTROY";
  const DO_CREATE = managerId + "_DO_CREATE";
  const DO_DESTROY = managerId + "_DO_DESTROY";

  const initialState: ManagerState<T> = new Map();

  const reducer = (state = initialState, action?: Action & Item<T>) => {
    if (action) {
      const { type, itemId } = action;

      switch (type) {
        case DO_CREATE: {
          const newState = new Map(state);
          newState.set(itemId, { itemId, payload: action.payload });
          return newState;
        }

        case DO_DESTROY: {
          const newState = new Map(state);
          newState.delete(itemId);
          return newState;
        }
      }
    }

    return state;
  };

  const create = (payload?: T) => ({
    type: CREATE,
    payload
  });

  const destroy = (itemId: string) => ({
    type: DESTROY,
    itemId
  });

  const makeTmpId = () => managerId + "_" + counter++;
  const getState = (state: CombinedState<T>) => state[managerId];

  const sagaManager = makeSagaManager();

  if (!parentManagerId) {
    sagaManager.add("createSaga", function* (): SagaGenerator {
      const { payload }: { payload: T } = yield take(CREATE);
      yield put({ type: DO_CREATE, itemId: makeTmpId(), payload });
    });

    sagaManager.add("destroySaga", function* (): SagaGenerator {
      const { itemId } = yield take(DESTROY);
      yield put({ type: DO_DESTROY, itemId });
    });
  }

  const children: Set<Manager<any>> = new Set();

  const addMappedChild = <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: U) => T,
    adaptFromParentToChild: (payload: T) => U
  ) => {
    // Use when listing a whole set of data: 1to1 correspondence.
    // Anything that happens to the parent in the background must be reflected in the child.
    // Anything that happens to the child through user interaction must be reflected in the parent.
    // So just delegate to the parent and propagate.
    const manager = makeManager<U>(childManagerId, managerId);
    const CHILD_CREATE = childManagerId + "_CREATE";
    const CHILD_DESTROY = childManagerId + "_DESTROY";
    const CHILD_DO_CREATE = childManagerId + "_DO_CREATE";
    const CHILD_DO_DESTROY = childManagerId + "_DO_DESTROY";

    manager.sagaManager.add("createSaga", function* (): SagaGenerator {
      const { payload }: { payload: U } = yield take(CHILD_CREATE);
      yield put({ type: CREATE, payload: adaptFromChildToParent(payload) });
    });

    manager.sagaManager.add("destroySaga", function* (): SagaGenerator {
      const { itemId } = yield take(CHILD_DESTROY);
      yield put({ type: DESTROY, itemId });
    });

    manager.sagaManager.add("doCreateSaga", function* (): SagaGenerator {
      const { itemId, payload }: { itemId: string; payload: T } = yield take(
        DO_CREATE
      );
      yield put({
        type: CHILD_DO_CREATE,
        itemId,
        payload: adaptFromParentToChild(payload)
      });
    });

    manager.sagaManager.add("doDestroySaga", function* (): SagaGenerator {
      const { itemId } = yield take(DO_DESTROY);
      yield put({ type: CHILD_DO_DESTROY, itemId });
    });

    children.add(manager);

    return manager;
  };

  const addFilteredChild = <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: U) => T,
    adaptFromParentToChild: (payload: T) => U
  ) => {
    // Use when listing a subset of data.
    // Destroying in parent must destroy in child.
    // Creating in child must create in parent.
    const manager = makeManager<U>(childManagerId, managerId);
    const CHILD_CREATE = childManagerId + "_CREATE";
    const CHILD_DESTROY = childManagerId + "_DESTROY";
    const CHILD_DO_CREATE = childManagerId + "_DO_CREATE";
    const CHILD_DO_DESTROY = childManagerId + "_DO_DESTROY";

    manager.sagaManager.add("createSaga", function* (): SagaGenerator {
      const { payload }: { payload: U } = yield take(CHILD_CREATE);
      yield put({ type: CREATE, payload: adaptFromChildToParent(payload) });

      const {
        itemId,
        payload: parentPayload
      }: { itemId: string; payload: T } = yield take(DO_CREATE);
      yield put({
        type: CHILD_DO_CREATE,
        itemId,
        payload: adaptFromParentToChild(parentPayload)
      });
    });

    manager.sagaManager.add("destroySaga", function* (): SagaGenerator {
      const { itemId } = yield take([CHILD_DESTROY, DO_DESTROY]);
      yield put({ type: CHILD_DO_DESTROY, itemId });
    });

    children.add(manager);

    return manager;
  };

  const getChildren = () => Array.from(children);

  return {
    managerId,
    reducer,
    create,
    destroy,
    getState,
    sagaManager,
    addMappedChild,
    addFilteredChild,
    getChildren
  };
};
