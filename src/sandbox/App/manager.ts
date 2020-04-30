import { all, call, put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import {
  CombinedState,
  Validator,
  Payload,
  PersistedItem,
  MutablePayloadMap,
  Errors,
  Manager,
  CreateAction,
  DestroyAction,
  ModifyAction,
  SetAction,
  DoCreateAction,
  DoModifyAction,
  DoSetAction,
  ManagerRelationship
} from "./types";
import { makeSagaManager } from "./saga-manager";
import { makeManagerConstants } from "./manager-constants";
import { makeManagerActionCreators } from "./manager-action-creators";
import { makeManagerReducer } from "./manager-reducer";
import { addCreateSagas, addDestroySagas, addModifySagas } from "./sagas";

let counter = 0;

export const makeManager = <T>(
  managerId: string,
  parentManagerId?: string
): Manager<T> => {
  const CONSTS = makeManagerConstants(managerId);
  const {
    CREATE,
    DESTROY,
    MODIFY,
    SET,
    DO_CREATE,
    DO_DESTROY,
    DO_MODIFY,
    DO_SET
  } = CONSTS;

  const actionCreators = makeManagerActionCreators<T>(CONSTS);
  const {
    create,
    modify,
    doCreate,
    doDestroy,
    doModify,
    doSet
  } = actionCreators;

  const reducer = makeManagerReducer<T>(CONSTS);

  const makeTmpId = () => managerId + "_" + counter++;

  const getState = (state: CombinedState) => state[managerId];
  const getItemMap = (state: CombinedState) => state[managerId].items;
  const getSelectionMap = (state: CombinedState) => state[managerId].selections;

  const sagaManager = makeSagaManager();

  const validators: Set<Validator<T>> = new Set();

  const addValidator = (validate: Validator<T>) => {
    if (parentManagerId) {
      throw new Error(
        `A child childManager cannot have validators: ${managerId}`
      );
    }

    validators.add(validate);
  };

  function* validateSaga(payload: PersistedItem<T>): SagaGenerator {
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
    sagaManager.add(CREATE, function* (): SagaGenerator {
      const { payload }: CreateAction<T> = yield take(CREATE);
      const errors: Errors | undefined = yield* validateSaga(payload);
      yield put(doCreate(makeTmpId(), { ...payload, errors } as const));
    });

    sagaManager.add(DESTROY, function* (): SagaGenerator {
      const { itemId }: DestroyAction<T> = yield take(DESTROY);
      yield put(doDestroy(itemId));
    });

    sagaManager.add(MODIFY, function* (): SagaGenerator {
      const { itemId, payload }: ModifyAction<T> = yield take(MODIFY);
      const errors: Errors = yield* validateSaga(payload);
      yield put(doModify(itemId, { ...payload, errors }));
    });

    sagaManager.add(SET, function* (): SagaGenerator {
      const {
        payload: { items: persistedItemMap, selections }
      }: SetAction<T> = yield take(SET);
      const payloadMap: MutablePayloadMap<T> = {};

      for (let [itemId, persistedItem] of Object.entries(persistedItemMap)) {
        const errors: Errors = yield* validateSaga(persistedItem);
        payloadMap[itemId] = { ...persistedItem, errors };
      }

      yield put(doSet({ items: payloadMap, selections }));
    });
  }

  const children: Set<Manager<any>> = new Set();

  const addMappedChild = <U>(
    childManagerId: string,
    adaptToParent: (payload: Payload<U>) => Payload<T>,
    adaptToChild: (payload: Payload<T>) => Payload<U>
  ) => {
    // Use when listing a whole set of data: 1to1 correspondence.
    // Anything that happens to the parent in the background must be reflected in the child.
    // Anything that happens to the child through user interaction must be reflected in the parent.
    // So just delegate to the parent and propagate.
    const childManager = makeManager<U>(childManagerId, managerId);
    const CHILD_CONSTS = makeManagerConstants(childManagerId);
    const { DO_SET: CHILD_DO_SET } = CHILD_CONSTS;
    const { doSet: childDoSet } = childManager.actionCreators;

    const sagaArgs = {
      manager,
      childManager,
      adaptToChild,
      adaptToParent,
      relationship: ManagerRelationship.MAP
    };

    addCreateSagas(sagaArgs);
    addDestroySagas(sagaArgs);
    addModifySagas(sagaArgs);

    childManager.sagaManager.add(CHILD_DO_SET, function* (): SagaGenerator {
      const {
        payload: { items: payloadMap }
      }: DoSetAction<T> = yield take(DO_SET);
      const childPayloadMap: MutablePayloadMap<U> = {};

      for (let [itemId, payload] of Object.entries(payloadMap)) {
        childPayloadMap[itemId] = adaptToChild(payload);
      }

      yield put(childDoSet({ items: childPayloadMap, selections: {} }));
    });

    children.add(childManager);

    return childManager;
  };

  const addFilteredChild = (childManagerId: string) => {
    // Use when listing a subset of data.
    // Destroying in parent must destroy in child.
    // Creating in child must create in parent.
    const childManager = makeManager<T>(childManagerId, managerId);
    const CHILD_CONSTS = makeManagerConstants(childManagerId);
    const {
      CREATE: CHILD_CREATE,
      DESTROY: CHILD_DESTROY,
      MODIFY: CHILD_MODIFY
    } = CHILD_CONSTS;
    const {
      doCreate: childDoCreate,
      doDestroy: childDoDestroy,
      doModify: childDoModify
    } = childManager.actionCreators;

    childManager.sagaManager.add(CHILD_CREATE, function* (): SagaGenerator {
      const { payload: childPayload }: CreateAction<T> = yield take(
        CHILD_CREATE
      );
      yield put(create(childPayload));

      const { itemId, payload }: DoCreateAction<T> = yield take(DO_CREATE);
      yield put(childDoCreate(itemId, payload));
    });

    childManager.sagaManager.add(CHILD_DESTROY, function* (): SagaGenerator {
      const { itemId }: DestroyAction<T> = yield take([
        CHILD_DESTROY,
        DO_DESTROY
      ]);
      yield put(childDoDestroy(itemId));
    });

    childManager.sagaManager.add(CHILD_MODIFY, function* (): SagaGenerator {
      const { itemId, payload: childPayload }: ModifyAction<T> = yield take(
        CHILD_MODIFY
      );
      yield put(modify(itemId, childPayload));

      const { payload }: DoModifyAction<T> = yield take(DO_MODIFY);
      yield put(childDoModify(itemId, payload));
    });

    children.add(childManager);

    return childManager;
  };

  const getChildren = () => Array.from(children);

  const manager = {
    managerId,
    CONSTS,
    actionCreators,
    reducer,
    getState,
    getItemMap,
    getSelectionMap,
    sagaManager,
    addMappedChild,
    addFilteredChild,
    getChildren,
    addValidator
  };

  return manager;
};
