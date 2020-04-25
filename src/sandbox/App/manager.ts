import { combineReducers, Action } from "redux";
import createSagaMiddleware, { SagaIterator } from "redux-saga";
import { fork, put, take } from "redux-saga/effects";

let counter = 0;

type Item = {
  itemId: string;
};

export type ManagerState = Map<string, Item>;
type MutableCombinedState = { [managerId: string]: ManagerState };
type CombinedState = Readonly<MutableCombinedState>;

type Reducer = (
  state?: ManagerState,
  action?: Action & { managerId: string; itemId: string }
) => ManagerState;
type MutableReducerMap = { [managerId: string]: Reducer };

export type Manager = Readonly<{
  managerId: string;
  reducer: Reducer;
  create: <T>(payload?: T) => void;
  destroy: (id: string) => void;
  getState: (state: CombinedState) => ManagerState;
  saga: () => SagaIterator;
  stopSaga: () => void;
}>;

type MutableManagerMap = {
  [managerId: string]: Omit<Manager, "managerId">;
};
type ManagerMap = Readonly<MutableManagerMap>;

type CombinedReducer = (
  state?: CombinedState,
  action?: Action
) => CombinedState;

const sagaMiddleware = createSagaMiddleware();
const runningSagas: Set<string> = new Set();

const makeManager = (managerId: string): Manager => {
  const CREATE = managerId + "_CREATE";
  const DESTROY = managerId + "_DESTROY";
  const DO_CREATE = managerId + "_DO_CREATE";
  const DO_DESTROY = managerId + "_DO_DESTROY";

  const initialState: ManagerState = new Map();

  const reducer = (
    state = initialState,
    action?: Action & { managerId: string; itemId: string }
  ) => {
    if (action) {
      const { type, itemId } = action;

      switch (type) {
        case DO_CREATE: {
          const newState = new Map(state);
          newState.set(itemId, { itemId });
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

  const create = <T>(payload?: T) => ({
    type: CREATE,
    payload
  });

  const destroy = (itemId: string) => ({
    type: DESTROY,
    itemId
  });

  const makeTmpId = () => managerId + "_" + counter++;
  const getState = (state: CombinedState) => state[managerId];

  function* createSaga(): SagaIterator {
    do {
      yield take(CREATE);
      yield put({ type: DO_CREATE, itemId: makeTmpId() });
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

  const stopSaga = () => {
    runningSagas.delete(managerId);
  };

  return { managerId, reducer, create, destroy, getState, saga, stopSaga };
};

export const makeCombinedManager = (managerIds: readonly string[]) => {
  const managers: MutableManagerMap = {};
  const reducers: MutableReducerMap = {};

  managerIds.forEach((managerId) => {
    managers[managerId] = makeManager(managerId);
    reducers[managerId] = managers[managerId].reducer;
  });

  // Type cannot be statically inferred by Typescript
  let combinedReducer = (combineReducers(
    reducers
  ) as unknown) as CombinedReducer;

  let managerIdsToRemove: string[] = [];

  const forEach = (
    fn: (
      manager: Omit<Manager, "managerId">,
      managerId: string,
      managers: ManagerMap
    ) => void
  ) => {
    Object.keys(managers).forEach((managerId) => {
      fn(managers[managerId], managerId, managers);
    });
  };

  const map = <T>(
    fn: (
      manager: Omit<Manager, "managerId">,
      managerId: string,
      managers: ManagerMap
    ) => T
  ) => {
    const map: { [key: string]: T } = {};

    Object.keys(managers).forEach((managerId) => {
      map[managerId] = fn(managers[managerId], managerId, managers);
    });

    return map;
  };

  const mapToArray = <T>(
    fn: (
      manager: Omit<Manager, "managerId">,
      managerId: string,
      managers: ManagerMap
    ) => T
  ) => {
    const map: T[] = [];

    Object.keys(managers).forEach((managerId) => {
      map.push(fn(managers[managerId], managerId, managers));
    });

    return map;
  };

  return {
    getManager: (managerId: string): Manager => ({
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

      managers[managerId] = makeManager(managerId);
      reducers[managerId] = managers[managerId].reducer;

      // Type cannot be statically inferred by Typescript
      combinedReducer = (combineReducers(
        reducers
      ) as unknown) as CombinedReducer;
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
      ) as unknown) as CombinedReducer;
    },

    reducer: (state?: CombinedState, action?: Action) => {
      if (managerIdsToRemove.length > 0) {
        const newState: MutableCombinedState = { ...state };

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
      forEach(({ saga }, managerId) => {
        if (runningSagas.has(managerId)) {
          return;
        }
        sagaMiddleware.run(saga);
        runningSagas.add(managerId);
      });
    }
  };
};
