import { Action } from "redux";
import { all, call, put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import { makeSagaManager, SagaManager } from "./saga-manager";

let counter = 0;

type Item<T> = Readonly<{ managerId: string; itemId: string; payload: T }>;
type Validator<T> = (payload: T) => readonly string[];

export type ManagerState<T> = Map<
  string,
  Readonly<{ itemId: string; payload: T }>
>;
export type MutableCombinedState = { [managerId: string]: ManagerState<any> };
export type CombinedState = Readonly<MutableCombinedState>;

export type Reducer<T> = (
  state?: ManagerState<T>,
  action?: Action & Item<T>
) => ManagerState<T>;

export type Manager<T> = Readonly<{
  managerId: string;
  reducer: Reducer<T>;
  create: (payload?: T) => void;
  destroy: (itemId: string) => void;
  modify: (itemId: string, payload: Partial<T>) => void;
  getState: (state: CombinedState) => ManagerState<T>;
  sagaManager: SagaManager;
  addMappedChild: <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: U) => T,
    adaptFromParentToChild: (payload: T, errors?: readonly string[]) => U
  ) => Manager<U>;
  addFilteredChild: <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: U) => T,
    adaptFromParentToChild: (payload: T, errors?: readonly string[]) => U
  ) => Manager<U>;
  getChildren: () => readonly Manager<any>[];
  addValidator: (validate: Validator<T>) => void;
}>;

export const makeManager = <T>(
  managerId: string,
  parentManagerId?: string
): Manager<T> => {
  const CREATE = managerId + "_CREATE";
  const DESTROY = managerId + "_DESTROY";
  const MODIFY = managerId + "_MODIFY";
  const DO_CREATE = managerId + "_DO_CREATE";
  const DO_DESTROY = managerId + "_DO_DESTROY";
  const DO_MODIFY = managerId + "_DO_MODIFY";

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

        case DO_MODIFY: {
          const { payload } = state.get(itemId)!;
          const newState = new Map(state);
          newState.set(itemId, {
            itemId,
            payload: { ...payload, ...action.payload }
          });
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

  const modify = (itemId: string, payload: Partial<T>) => ({
    type: MODIFY,
    itemId,
    payload
  });

  const makeTmpId = () => managerId + "_" + counter++;
  const getState = (state: CombinedState) => state[managerId];

  const sagaManager = makeSagaManager();

  const createSagaName = "createSaga";
  const destroySagaName = "destroySaga";
  const modifySagaName = "modifySaga";

  const validators: Set<Validator<T>> = new Set();

  const addValidator = (validate: Validator<T>) => {
    if (parentManagerId) {
      throw new Error(`A child manager cannot have validators: ${managerId}`);
    }

    validators.add(validate);
  };

  function* validateSaga(payload: T): SagaGenerator {
    const validationMessages: string[][] = yield all(
      Array.from(validators).map((validate) => call(validate, payload))
    );

    const errors: Set<string> = new Set();
    validationMessages.forEach((msgs) =>
      msgs.forEach((msg) => errors.add(msg))
    );

    return Array.from(errors);
  }

  if (!parentManagerId) {
    sagaManager.add(createSagaName, function* (): SagaGenerator {
      const { payload }: { payload: T } = yield take(CREATE);
      const errors = yield* validateSaga(payload);
      yield put({ type: DO_CREATE, itemId: makeTmpId(), payload, errors });
    });

    sagaManager.add(destroySagaName, function* (): SagaGenerator {
      const { itemId } = yield take(DESTROY);
      yield put({ type: DO_DESTROY, itemId });
    });

    sagaManager.add(modifySagaName, function* (): SagaGenerator {
      const { itemId, payload }: { itemId: string; payload: T } = yield take(
        MODIFY
      );
      const errors = yield* validateSaga(payload);
      yield put({ type: DO_MODIFY, itemId, payload, errors });
    });
  }

  const children: Set<Manager<any>> = new Set();

  const addMappedChild = <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: U) => T,
    adaptFromParentToChild: (payload: T, errors?: readonly string[]) => U
  ) => {
    // Use when listing a whole set of data: 1to1 correspondence.
    // Anything that happens to the parent in the background must be reflected in the child.
    // Anything that happens to the child through user interaction must be reflected in the parent.
    // So just delegate to the parent and propagate.
    const manager = makeManager<U>(childManagerId, managerId);

    const CHILD_CREATE = childManagerId + "_CREATE";
    const CHILD_DESTROY = childManagerId + "_DESTROY";
    const CHILD_MODIFY = childManagerId + "_MODIFY";
    const CHILD_DO_CREATE = childManagerId + "_DO_CREATE";
    const CHILD_DO_DESTROY = childManagerId + "_DO_DESTROY";
    const CHILD_DO_MODIFY = childManagerId + "_DO_MODIFY";

    manager.sagaManager.add(createSagaName, function* (): SagaGenerator {
      const { payload }: { payload: U } = yield take(CHILD_CREATE);
      yield put({ type: CREATE, payload: adaptFromChildToParent(payload) });
    });

    manager.sagaManager.add(destroySagaName, function* (): SagaGenerator {
      const { itemId }: { itemId: string } = yield take(CHILD_DESTROY);
      yield put({ type: DESTROY, itemId });
    });

    manager.sagaManager.add(modifySagaName, function* (): SagaGenerator {
      const { itemId, payload }: { itemId: string; payload: U } = yield take(
        CHILD_MODIFY
      );
      yield put({
        type: MODIFY,
        itemId,
        payload: adaptFromChildToParent(payload)
      });
    });

    manager.sagaManager.add("doCreateSaga", function* (): SagaGenerator {
      const {
        itemId,
        payload,
        errors
      }: { itemId: string; payload: T; errors: string[] } = yield take(
        DO_CREATE
      );
      yield put({
        type: CHILD_DO_CREATE,
        itemId,
        payload: adaptFromParentToChild(payload, errors)
      });
    });

    manager.sagaManager.add("doDestroySaga", function* (): SagaGenerator {
      const { itemId } = yield take(DO_DESTROY);
      yield put({ type: CHILD_DO_DESTROY, itemId });
    });

    manager.sagaManager.add("doModifySaga", function* (): SagaGenerator {
      const {
        itemId,
        payload,
        errors
      }: { itemId: string; payload: T; errors: string[] } = yield take(
        DO_MODIFY
      );
      yield put({
        type: CHILD_DO_MODIFY,
        itemId,
        payload: adaptFromParentToChild(payload, errors)
      });
    });

    children.add(manager);

    return manager;
  };

  const addFilteredChild = <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: U) => T,
    adaptFromParentToChild: (payload: T, errors?: readonly string[]) => U
  ) => {
    // Use when listing a subset of data.
    // Destroying in parent must destroy in child.
    // Creating in child must create in parent.
    const manager = makeManager<U>(childManagerId, managerId);

    const CHILD_CREATE = childManagerId + "_CREATE";
    const CHILD_DESTROY = childManagerId + "_DESTROY";
    const CHILD_MODIFY = childManagerId + "_MODIFY";
    const CHILD_DO_CREATE = childManagerId + "_DO_CREATE";
    const CHILD_DO_DESTROY = childManagerId + "_DO_DESTROY";
    const CHILD_DO_MODIFY = childManagerId + "_DO_MODIFY";

    manager.sagaManager.add(createSagaName, function* (): SagaGenerator {
      const { payload }: { payload: U } = yield take(CHILD_CREATE);
      yield put({ type: CREATE, payload: adaptFromChildToParent(payload) });

      const {
        itemId,
        payload: parentPayload,
        errors
      }: { itemId: string; payload: T; errors: string[] } = yield take(
        DO_CREATE
      );
      yield put({
        type: CHILD_DO_CREATE,
        itemId,
        payload: adaptFromParentToChild(parentPayload, errors)
      });
    });

    manager.sagaManager.add(destroySagaName, function* (): SagaGenerator {
      const { itemId } = yield take([CHILD_DESTROY, DO_DESTROY]);
      yield put({ type: CHILD_DO_DESTROY, itemId });
    });

    manager.sagaManager.add(modifySagaName, function* (): SagaGenerator {
      const { itemId, payload }: { itemId: string; payload: U } = yield take(
        CHILD_MODIFY
      );
      yield put({
        type: MODIFY,
        itemId,
        payload: adaptFromChildToParent(payload)
      });

      const {
        payload: parentPayload,
        errors
      }: { payload: T; errors: string[] } = yield take(DO_MODIFY);
      yield put({
        type: CHILD_DO_MODIFY,
        itemId,
        payload: adaptFromParentToChild(parentPayload, errors)
      });
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
    modify,
    getState,
    sagaManager,
    addMappedChild,
    addFilteredChild,
    getChildren,
    addValidator
  };
};
