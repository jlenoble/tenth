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
}>;

export const makeManager = <T>(managerId: string): Manager<T> => {
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

  sagaManager.add("createSaga", function* (): SagaGenerator {
    const { payload }: { payload: T } = yield take(CREATE);
    yield put({ type: DO_CREATE, itemId: makeTmpId(), payload });
  });

  sagaManager.add("destroySaga", function* (): SagaGenerator {
    const { itemId } = yield take(DESTROY);
    yield put({ type: DO_DESTROY, itemId });
  });

  return {
    managerId,
    reducer,
    create,
    destroy,
    getState,
    sagaManager
  };
};
