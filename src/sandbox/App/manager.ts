import { Action } from "redux";
import createSagaMiddleware, { SagaIterator } from "redux-saga";
import { put, take } from "redux-saga/effects";

let counter = 0;

export type ManagerState<T> = Map<
  string,
  Readonly<{ itemId: string; payload: T }>
>;
export type MutableCombinedState<T> = { [managerId: string]: ManagerState<T> };
export type CombinedState<T> = Readonly<MutableCombinedState<T>>;

export type Reducer<T> = (
  state?: ManagerState<T>,
  action?: Action & { managerId: string; itemId: string; payload: T }
) => ManagerState<T>;

export type Manager<T> = Readonly<{
  managerId: string;
  reducer: Reducer<T>;
  create: (payload?: T) => void;
  destroy: (id: string) => void;
  getState: (state: CombinedState<T>) => ManagerState<T>;
  startSagas: () => void;
  stopSagas: () => void;
}>;

export const sagaMiddleware = createSagaMiddleware();

export const makeManager = <T>(managerId: string): Manager<T> => {
  const CREATE = managerId + "_CREATE";
  const DESTROY = managerId + "_DESTROY";
  const DO_CREATE = managerId + "_DO_CREATE";
  const DO_DESTROY = managerId + "_DO_DESTROY";

  const initialState: ManagerState<T> = new Map();

  const reducer = (
    state = initialState,
    action?: Action & { managerId: string; itemId: string; payload: T }
  ) => {
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

  const sagas: Map<string, () => SagaIterator> = new Map();
  const runningSagas: Set<string> = new Set();

  sagas.set("createSaga", function* (): SagaIterator {
    do {
      const { payload }: { payload: T } = yield take(CREATE);
      yield put({ type: DO_CREATE, itemId: makeTmpId(), payload });
    } while (runningSagas.has("createSaga"));
  });

  sagas.set("destroySaga", function* (): SagaIterator {
    do {
      const { itemId } = yield take(DESTROY);
      yield put({ type: DO_DESTROY, itemId });
    } while (runningSagas.has("destroySaga"));
  });

  const startSagas = () => {
    sagas.forEach((saga, sagaName) => {
      if (!runningSagas.has(sagaName)) {
        sagaMiddleware.run(saga);
        runningSagas.add(sagaName);
      }
    });
  };

  const stopSagas = () => {
    runningSagas.delete(managerId);
  };

  return {
    managerId,
    reducer,
    create,
    destroy,
    getState,
    startSagas,
    stopSagas
  };
};
