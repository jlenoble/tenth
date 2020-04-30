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
  SetVisibilityFilterAction,
  ManagerRelationship,
  StateSelectorMap
} from "./types";
import { makeSagaManager } from "./saga-manager";
import { makeManagerConstants } from "./manager-constants";
import { makeManagerActionCreators } from "./manager-action-creators";
import { makeManagerReducer } from "./manager-reducer";
import {
  addCreateSagas,
  addDestroySagas,
  addModifySagas,
  addSetSagas,
  addSetVisibilityFilterSagas
} from "./sagas";

let counter = 0;

export const makeManager = <T>(
  managerId: string,
  parentManagerId?: string
): Manager<T> => {
  const CONSTS = makeManagerConstants(managerId);
  const { CREATE, DESTROY, MODIFY, SET, SET_VISIBILITY_FILTER } = CONSTS;

  const actionCreators = makeManagerActionCreators<T>(CONSTS);
  const {
    doCreate,
    doDestroy,
    doModify,
    doSet,
    doSetVisibilityFilter
  } = actionCreators;

  const reducer = makeManagerReducer<T>(CONSTS);

  const makeTmpId = () => managerId + "_" + counter++;

  const stateSelectors: StateSelectorMap<T> = {
    getState: (state: CombinedState) => state[managerId],
    getItemMap: (state: CombinedState) => state[managerId].items,
    getSelectionMap: (state: CombinedState) => state[managerId].selections,
    getVisibilityFilter: (state: CombinedState) =>
      state[managerId].visibilityFilter
  };

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

    sagaManager.add(SET_VISIBILITY_FILTER, function* (): SagaGenerator {
      const { visibilityFilter }: SetVisibilityFilterAction<T> = yield take(
        SET_VISIBILITY_FILTER
      );
      yield put(doSetVisibilityFilter(visibilityFilter));
    });
  }

  const children: Set<Manager<any>> = new Set();

  const addChild = <U>(
    childManagerId: string,
    {
      adaptToParent,
      adaptToChild,
      relationship,
      selectionId
    }: {
      adaptToParent?: (payload: Payload<U>) => Payload<T>;
      adaptToChild?: (payload: Payload<T>) => Payload<U>;
      relationship: ManagerRelationship;
      selectionId?: string;
    }
  ) => {
    const childManager = makeManager<U>(childManagerId, managerId);

    const sagaArgs = {
      manager,
      childManager,
      adaptToChild,
      adaptToParent,
      relationship,
      selectionId
    };

    addCreateSagas(sagaArgs);
    addDestroySagas(sagaArgs);
    addModifySagas(sagaArgs);
    addSetSagas(sagaArgs);
    addSetVisibilityFilterSagas(sagaArgs);

    children.add(childManager);

    return childManager;
  };

  const getChildren = () => Array.from(children);
  const getDescendants = () => {
    let descendants: Manager<any>[] = [];

    for (let manager of children.values()) {
      descendants.push(manager);

      if (manager.getChildren().length) {
        descendants = descendants.concat(manager.getDescendants());
      }
    }

    return descendants;
  };

  const manager = {
    managerId,
    CONSTS,
    actionCreators,
    stateSelectors,
    reducer,
    sagaManager,
    addChild,
    getChildren,
    getDescendants,
    addValidator
  };

  return manager;
};
