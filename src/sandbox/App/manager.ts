import { Action } from "redux";
import createSagaMiddleware from "redux-saga";
import { put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";

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
  addSaga: (sagaName: string, saga: () => SagaGenerator) => void;
  removeSaga: (sagaName: string) => void;
  runSaga: (sagaName: string, saga: () => SagaGenerator) => void;
  startSagas: () => void;
  stopSagas: () => void;
}>;

export const sagaMiddleware = createSagaMiddleware();

export const makeManager = <T>(managerId: string): Manager<T> => {
  type Item<T> = { managerId: string; itemId: string; payload: T };

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

  const sagas: Map<string, () => SagaGenerator> = new Map();
  const runningSagas: Set<string> = new Set();

  const addSaga = (sagaName: string, saga: () => SagaGenerator) => {
    if (sagas.has(sagaName)) {
      return;
    }

    const newSaga = function* (): SagaGenerator {
      do {
        yield* saga();
      } while (runningSagas.has(sagaName));
    };

    sagas.set(sagaName, newSaga);
  };

  const removeSaga = (sagaName: string) => {
    sagas.delete(sagaName);
    runningSagas.delete(sagaName);
  };

  const runSaga = (sagaName: string, saga: () => SagaGenerator) => {
    if (!runningSagas.has(sagaName)) {
      addSaga(sagaName, saga);
      const newSaga = sagas.get(sagaName)!;
      sagaMiddleware.run(newSaga);
      runningSagas.add(sagaName);
    }
  };

  addSaga("createSaga", function* (): SagaGenerator {
    const { payload }: { payload: T } = yield take(CREATE);
    yield put({ type: DO_CREATE, itemId: makeTmpId(), payload });
  });

  addSaga("destroySaga", function* (): SagaGenerator {
    const { itemId } = yield take(DESTROY);
    yield put({ type: DO_DESTROY, itemId });
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
    addSaga,
    removeSaga,
    runSaga,
    startSagas,
    stopSagas
  };
};
