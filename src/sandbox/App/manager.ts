import { all, call, put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import {
  CombinedState,
  Validator,
  PersistedItem,
  MutablePayloadMap,
  Errors,
  Manager,
  ManagerProgenyHandler,
  CreateAction,
  DestroyAction,
  ModifyAction,
  SetAction,
  SetVisibilityFilterAction,
  StateSelectorMap
} from "./types";
import { makeSagaManager } from "./saga-manager";
import { makeManagerConstants } from "./manager-constants";
import { makeManagerActionCreators } from "./manager-action-creators";
import { makeManagerReducer } from "./manager-reducer";
import { makeManagerProgenyHandler } from "./manager-progeny-handler";

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

  const manager = {
    managerId,
    CONSTS,
    actionCreators,
    stateSelectors,
    reducer,
    sagaManager,
    addValidator,
    get progenyHandler(): ManagerProgenyHandler<T> {
      throw new Error("Manager.progenyHandler accessed before being set");
    }
  };

  Object.defineProperty(manager, "progenyHandler", {
    value: makeManagerProgenyHandler<T>(manager, makeManager),
    writable: false,
    enumerable: true,
    configurable: false
  });

  return manager;
};
