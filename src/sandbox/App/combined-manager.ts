import { combineReducers, Action } from "redux";
import { put } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import {
  MutableCombinedState,
  CombinedState,
  MutableReducerMap,
  CombinedReducer,
  Manager,
  MutableManagerMap,
  ManagerMap,
} from "./types";
import { sagaMiddleware } from "./saga-manager";

export const makeCombinedManager = (
  initialManagers: readonly Manager<any>[]
) => {
  const managers: MutableManagerMap<any> = {};
  const reducers: MutableReducerMap<any> = {};

  const addToMaps = (manager: Manager<any>) => {
    const managerId = manager.managerId;

    if (reducers[managerId]) {
      throw new Error(
        `A manager was already combined with the name: ${managerId}`
      );
    }

    managers[managerId] = manager;
    reducers[managerId] = manager.reducer;

    manager.progenyHandler.getChildren().forEach(addToMaps);
  };

  let managerIdsToRemove: string[] = [];

  const removeFromMaps = (managerId: Manager<any> | string) => {
    const manager =
      typeof managerId === "string" ? managers[managerId] : managerId;
    const id = manager.managerId;

    if (!manager) {
      return;
    }

    manager.progenyHandler.getChildren().forEach(removeFromMaps);

    delete managers[id];
    delete reducers[id];

    managerIdsToRemove.push(id);
  };

  initialManagers.forEach(addToMaps);

  // Type cannot be statically inferred by Typescript
  let combinedReducer = (combineReducers(
    reducers
  ) as unknown) as CombinedReducer;

  const forEach = (
    fn: (
      manager: Omit<Manager<any>, "managerId">,
      managerId: string,
      managers: ManagerMap<any>
    ) => void
  ) => {
    Object.keys(managers).forEach((managerId) => {
      fn(managers[managerId], managerId, managers);
    });
  };

  const map = <U>(
    fn: (
      manager: Omit<Manager<any>, "managerId">,
      managerId: string,
      managers: ManagerMap<any>
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
      manager: Omit<Manager<any>, "managerId">,
      managerId: string,
      managers: ManagerMap<any>
    ) => U
  ) => {
    const map: U[] = [];

    Object.keys(managers).forEach((managerId) => {
      map.push(fn(managers[managerId], managerId, managers));
    });

    return map;
  };

  return {
    getManager: (managerId: string): Manager<any> => managers[managerId],

    getManagers: (): Manager<any>[] => Object.values(managers),

    getManagerIds: (): string[] => Object.keys(managers),

    forEach,
    map,
    mapToArray,

    add: (manager: Manager<any>) => {
      addToMaps(manager);

      // Type cannot be statically inferred by Typescript
      combinedReducer = (combineReducers(
        reducers
      ) as unknown) as CombinedReducer;
    },

    remove: (manager: Manager<any> | string) => {
      removeFromMaps(manager);

      // Type cannot be statically inferred by Typescript
      combinedReducer = (combineReducers(
        reducers
      ) as unknown) as CombinedReducer;
    },

    reducer: (state?: CombinedState, action?: Action) => {
      if (managerIdsToRemove.length > 0) {
        const newState: MutableCombinedState = { ...state };

        for (const managerId of managerIdsToRemove) {
          delete newState[managerId];
        }

        managerIdsToRemove = [];

        return combinedReducer(newState, action);
      }

      return combinedReducer(state, action);
    },

    sagaMiddleware,

    runSagas: () => {
      forEach(({ sagaManager }) => sagaManager.startAll());
      forEach(({ actionCreators: { ready } }) =>
        sagaMiddleware.run(function* (): SagaGenerator {
          yield put(ready());
        })
      );
    },
  };
};
