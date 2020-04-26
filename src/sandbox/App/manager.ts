import { combineReducers, Action } from "redux";
import createSagaMiddleware, { SagaIterator } from "redux-saga";
import { fork, put, take } from "redux-saga/effects";

let counter = 0;

export type ManagerState<T> = Map<
  string,
  Readonly<{ itemId: string; payload: T }>
>;
type MutableCombinedState<T> = { [managerId: string]: ManagerState<T> };
type CombinedState<T> = Readonly<MutableCombinedState<T>>;

type Reducer<T> = (
  state?: ManagerState<T>,
  action?: Action & { managerId: string; itemId: string; payload: T }
) => ManagerState<T>;
type MutableReducerMap<T> = { [managerId: string]: Reducer<T> };

export type Manager<T> = Readonly<{
  managerId: string;
  reducer: Reducer<T>;
  create: (payload?: T) => void;
  destroy: (id: string) => void;
  getState: (state: CombinedState<T>) => ManagerState<T>;
  startSaga: () => void;
  stopSaga: () => void;
}>;

type MutableManagerMap<T> = {
  [managerId: string]: Omit<Manager<T>, "managerId">;
};
type ManagerMap<T> = Readonly<MutableManagerMap<T>>;

type CombinedReducer<T> = (
  state?: CombinedState<T>,
  action?: Action
) => CombinedState<T>;

const sagaMiddleware = createSagaMiddleware();
const runningSagas: Set<string> = new Set();

const makeManager = <T>(managerId: string): Manager<T> => {
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

  function* createSaga(): SagaIterator {
    do {
      const { payload }: { payload: T } = yield take(CREATE);
      yield put({ type: DO_CREATE, itemId: makeTmpId(), payload });
    } while (runningSagas.has(managerId));
  }

  function* destroySaga(): SagaIterator {
    do {
      const { itemId } = yield take(DESTROY);
      yield put({ type: DO_DESTROY, itemId });
    } while (runningSagas.has(managerId));
  }

  function* saga(): SagaIterator {
    yield fork(createSaga);
    yield fork(destroySaga);
  }

  const startSaga = () => {
    if (!runningSagas.has(managerId)) {
      sagaMiddleware.run(saga);
      runningSagas.add(managerId);
    }
  };

  const stopSaga = () => {
    runningSagas.delete(managerId);
  };

  return {
    managerId,
    reducer,
    create,
    destroy,
    getState,
    startSaga,
    stopSaga
  };
};

export const makeCombinedManager = <T>(managerIds: readonly string[]) => {
  const managers: MutableManagerMap<T> = {};
  const reducers: MutableReducerMap<T> = {};

  managerIds.forEach((managerId) => {
    managers[managerId] = makeManager<T>(managerId);
    reducers[managerId] = managers[managerId].reducer;
  });

  // Type cannot be statically inferred by Typescript
  let combinedReducer = (combineReducers(
    reducers
  ) as unknown) as CombinedReducer<T>;

  let managerIdsToRemove: string[] = [];

  const forEach = (
    fn: (
      manager: Omit<Manager<T>, "managerId">,
      managerId: string,
      managers: ManagerMap<T>
    ) => void
  ) => {
    Object.keys(managers).forEach((managerId) => {
      fn(managers[managerId], managerId, managers);
    });
  };

  const map = <U>(
    fn: (
      manager: Omit<Manager<T>, "managerId">,
      managerId: string,
      managers: ManagerMap<T>
    ) => U
  ) => {
    const map: { [key: string]: U } = {};

    Object.keys(managers).forEach((managerId) => {
      map[managerId] = fn(managers[managerId], managerId, managers);
    });

    return map;
  };

  const mapToArray = <U>(
    fn: (
      manager: Omit<Manager<T>, "managerId">,
      managerId: string,
      managers: ManagerMap<T>
    ) => U
  ) => {
    const map: U[] = [];

    Object.keys(managers).forEach((managerId) => {
      map.push(fn(managers[managerId], managerId, managers));
    });

    return map;
  };

  return {
    getManager: (managerId: string): Manager<T> => ({
      managerId,
      ...managers[managerId]
    }),

    getManagerIds: (): string[] => Object.keys(managers),

    forEach,
    map,
    mapToArray,

    add: (managerId: string) => {
      if (reducers[managerId]) {
        return;
      }

      managers[managerId] = makeManager<T>(managerId);
      reducers[managerId] = managers[managerId].reducer;

      // Type cannot be statically inferred by Typescript
      combinedReducer = (combineReducers(
        reducers
      ) as unknown) as CombinedReducer<T>;
    },

    remove: (managerId: string) => {
      if (!managers[managerId]) {
        return;
      }

      delete managers[managerId];
      delete reducers[managerId];

      managerIdsToRemove.push(managerId);

      // Type cannot be statically inferred by Typescript
      combinedReducer = (combineReducers(
        reducers
      ) as unknown) as CombinedReducer<T>;
    },

    reducer: (state?: CombinedState<T>, action?: Action) => {
      if (managerIdsToRemove.length > 0) {
        const newState: MutableCombinedState<T> = { ...state };

        for (let managerId of managerIdsToRemove) {
          delete newState[managerId];
        }

        managerIdsToRemove = [];

        return combinedReducer(newState, action);
      }

      return combinedReducer(state, action);
    },

    sagaMiddleware,

    runSagas: () => {
      forEach(({ startSaga }) => startSaga());
    }
  };
};
