import { combineReducers, Action } from "redux";
import { Reducer, MutableCombinedState, CombinedState } from "./types";
import { Manager } from "./manager";
import { sagaMiddleware } from "./saga-manager";

type MutableReducerMap = { [managerId: string]: Reducer<any> };

type MutableManagerMap = {
  [managerId: string]: Manager<any>;
};

type ManagerMap<T> = Readonly<MutableManagerMap>;

type CombinedReducer = (
  state?: CombinedState,
  action?: Action
) => CombinedState;

export const makeCombinedManager = (
  initialManagers: readonly Manager<any>[]
) => {
  const managers: MutableManagerMap = {};
  const reducers: MutableReducerMap = {};

  const addToMaps = (manager: Manager<any>) => {
    const managerId = manager.managerId;

    if (reducers[managerId]) {
      throw new Error(
        `A manager was already combined with the name: ${managerId}`
      );
    }

    managers[managerId] = manager;
    reducers[managerId] = manager.reducer;

    manager.getChildren().forEach(addToMaps);
  };

  const removeFromMaps = (managerId: Manager<any> | string) => {
    const manager =
      typeof managerId === "string" ? managers[managerId] : managerId;
    const id = manager.managerId;

    if (!manager) {
      return;
    }

    manager.getChildren().forEach(removeFromMaps);

    delete managers[id];
    delete reducers[id];

    managerIdsToRemove.push(id);
  };

  initialManagers.forEach(addToMaps);

  // Type cannot be statically inferred by Typescript
  let combinedReducer = (combineReducers(
    reducers
  ) as unknown) as CombinedReducer;

  let managerIdsToRemove: string[] = [];

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
      forEach(({ sagaManager }) => sagaManager.startAll());
    }
  };
};
