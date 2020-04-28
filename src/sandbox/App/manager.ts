import { all, call, put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import { Reducer, CombinedState, ManagerState, Validator } from "./types";
import { makeSagaManager, SagaManager } from "./saga-manager";
import { makeManagerConstants } from "./manager-constants";
import { makeManagerActionCreators } from "./manager-action-creators";
import { makeManagerReducer } from "./manager-reducer";

let counter = 0;

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
  // addFilteredChild: <U>(
  //   childManagerId: string,
  //   adaptFromChildToParent: (payload: U) => T,
  //   adaptFromParentToChild: (payload: T, errors?: readonly string[]) => U
  // ) => Manager<U>;
  getChildren: () => readonly Manager<any>[];
  addValidator: (validate: Validator<T>) => void;
}>;

export const makeManager = <T>(
  managerId: string,
  parentManagerId?: string
): Manager<T> => {
  const CONSTS = makeManagerConstants(managerId);
  const { CREATE, DESTROY, MODIFY, DO_CREATE, DO_DESTROY, DO_MODIFY } = CONSTS;

  const actionCreators = makeManagerActionCreators(CONSTS);
  const { create, destroy, modify } = actionCreators;

  const reducer = makeManagerReducer<T>(CONSTS);

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
    const CHILD_CONSTS = makeManagerConstants(childManagerId);

    manager.sagaManager.add(createSagaName, function* (): SagaGenerator {
      const { payload }: { payload: U } = yield take(CHILD_CONSTS.CREATE);
      yield put({ type: CREATE, payload: adaptFromChildToParent(payload) });
    });

    manager.sagaManager.add(destroySagaName, function* (): SagaGenerator {
      const { itemId }: { itemId: string } = yield take(CHILD_CONSTS.DESTROY);
      yield put({ type: DESTROY, itemId });
    });

    manager.sagaManager.add(modifySagaName, function* (): SagaGenerator {
      const { itemId, payload }: { itemId: string; payload: U } = yield take(
        CHILD_CONSTS.MODIFY
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
        type: CHILD_CONSTS.DO_CREATE,
        itemId,
        payload: adaptFromParentToChild(payload, errors)
      });
    });

    manager.sagaManager.add("doDestroySaga", function* (): SagaGenerator {
      const { itemId } = yield take(DO_DESTROY);
      yield put({ type: CHILD_CONSTS.DO_DESTROY, itemId });
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
        type: CHILD_CONSTS.DO_MODIFY,
        itemId,
        payload: adaptFromParentToChild(payload, errors)
      });
    });

    children.add(manager);

    return manager;
  };

  // const addFilteredChild = <U>(
  //   childManagerId: string,
  //   adaptFromChildToParent: (payload: U) => T,
  //   adaptFromParentToChild: (payload: T, errors?: readonly string[]) => U
  // ) => {
  //   // Use when listing a subset of data.
  //   // Destroying in parent must destroy in child.
  //   // Creating in child must create in parent.
  //   const manager = makeManager<U>(childManagerId, managerId);
  //   const CHILD_CONSTS = makeManagerConstants(childManagerId);

  //   manager.sagaManager.add(createSagaName, function* (): SagaGenerator {
  //     const { payload }: { payload: U } = yield take(CHILD_CONSTS.CREATE);
  //     yield put({ type: CREATE, payload: adaptFromChildToParent(payload) });

  //     const {
  //       itemId,
  //       payload: parentPayload,
  //       errors
  //     }: { itemId: string; payload: T; errors: string[] } = yield take(
  //       DO_CREATE
  //     );
  //     yield put({
  //       type: CHILD_CONSTS.DO_CREATE,
  //       itemId,
  //       payload: adaptFromParentToChild(parentPayload, errors)
  //     });
  //   });

  //   manager.sagaManager.add(destroySagaName, function* (): SagaGenerator {
  //     const { itemId } = yield take([CHILD_CONSTS.DESTROY, DO_DESTROY]);
  //     yield put({ type: CHILD_CONSTS.DO_DESTROY, itemId });
  //   });

  //   manager.sagaManager.add(modifySagaName, function* (): SagaGenerator {
  //     const { itemId, payload }: { itemId: string; payload: U } = yield take(
  //       CHILD_CONSTS.MODIFY
  //     );
  //     yield put({
  //       type: MODIFY,
  //       itemId,
  //       payload: adaptFromChildToParent(payload)
  //     });

  //     const {
  //       payload: parentPayload,
  //       errors
  //     }: { payload: T; errors: string[] } = yield take(DO_MODIFY);
  //     yield put({
  //       type: CHILD_CONSTS.DO_MODIFY,
  //       itemId,
  //       payload: adaptFromParentToChild(parentPayload, errors)
  //     });
  //   });

  //   children.add(manager);

  //   return manager;
  // };

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
    // addFilteredChild,
    getChildren,
    addValidator
  };
};
