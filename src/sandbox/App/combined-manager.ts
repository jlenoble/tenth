import { combineReducers, Action } from "redux";
import {
  Manager,
  Reducer,
  MutableCombinedState,
  CombinedState,
  makeManager,
  sagaMiddleware
} from "./manager";

type MutableReducerMap<T> = { [managerId: string]: Reducer<T> };

type MutableManagerMap<T> = {
  [managerId: string]: Omit<Manager<T>, "managerId">;
};

type ManagerMap<T> = Readonly<MutableManagerMap<T>>;

type CombinedReducer<T> = (
  state?: CombinedState<T>,
  action?: Action
) => CombinedState<T>;

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

    getManagers: (): Manager<T>[] =>
      Object.keys(managers).map((managerId) => ({
        managerId,
        ...managers[managerId]
      })),

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
      forEach(({ startSagas }) => startSagas());
    }
  };
};
