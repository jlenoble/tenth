import { combineReducers, Action as ReduxAction } from "redux";
import { newViewId } from "./ids";

type View = Readonly<{ viewId: string }>;

export type ViewMap = Readonly<{
  [viewId: string]: Omit<View, "viewId">;
}>;

type State = ViewMap;

type Reducer = (state?: State, Action?: Action) => State;
type MutableReducerMap = { [managerId: string]: Reducer };
type ReducerMap = Readonly<MutableReducerMap>;

export type Manager = Readonly<{
  managerId: string;
  reducer: Reducer;
  create: () => void;
  close: (viewId: string) => void;
  getState: (state: CombinedState) => State;
}>;

type MutableManagerMap = {
  [managerId: string]: Omit<Manager, "managerId">;
};
type ManagerMap = Readonly<MutableManagerMap>;

type MutableCombinedState = { [managerId: string]: State };
type CombinedState = Readonly<MutableCombinedState>;
type CombinedReducer = (
  state?: CombinedState,
  action?: ReduxAction
) => CombinedState;

const CLOSE = "CLOSE";
const CREATE = "CREATE";

type CloseAction = {
  type: typeof CLOSE;
  managerId: string;
  viewId: string;
};

type CreateAction = {
  type: typeof CREATE;
  managerId: string;
};

type Action = CloseAction | CreateAction;

const closeView = ({
  managerId,
  viewId
}: {
  managerId: string;
  viewId: string;
}): Action => {
  return {
    type: CLOSE,
    managerId,
    viewId
  };
};

const createView = ({ managerId }: { managerId: string }): Action => {
  return {
    type: CREATE,
    managerId
  };
};

const makeReducer = (managerId: string) => {
  const initialState: State = {};

  const views: Reducer = (state = initialState, action?: Action) => {
    if (action && action.managerId === managerId) {
      switch (action.type) {
        case CLOSE: {
          const newState = { ...state };
          delete newState[action.viewId];
          return newState;
        }

        case CREATE: {
          return { ...state, [newViewId()]: {} };
        }
      }
    }

    return state;
  };

  return views;
};

const makeManager = (managerId: string): Manager => {
  const reducer = makeReducer(managerId);
  const create = () => createView({ managerId });
  const close = (viewId: string) => closeView({ managerId, viewId });
  const getState = (state: CombinedState) => state[managerId];

  return { managerId, reducer, create, close, getState };
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

  return {
    getManagerIds: (): string[] => Object.keys(managers),

    getManager: (managerId: string): Manager => ({
      managerId,
      ...managers[managerId]
    }),

    reducer: (state?: CombinedState, action?: ReduxAction) => {
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
    }
  };
};
