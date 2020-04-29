import { all, call, put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../generics";
import {
  CombinedState,
  ManagerState,
  Validator,
  Payload,
  PersistedItem,
  MutablePayloadMap,
  Errors
} from "./types";
import { makeSagaManager, SagaManager } from "./saga-manager";
import { makeManagerConstants, ManagerConsts } from "./manager-constants";
import {
  makeManagerActionCreators,
  ActionCreatorMap,
  CreateAction,
  DestroyAction,
  ModifyAction,
  SetAction,
  DoCreateAction,
  DoDestroyAction,
  DoModifyAction,
  DoSetAction
} from "./manager-action-creators";
import { ManagerReducer, makeManagerReducer } from "./manager-reducer";

let counter = 0;

export type Manager<T> = Readonly<{
  managerId: string;
  CONSTS: ManagerConsts;
  actionCreators: ActionCreatorMap<T>;
  reducer: ManagerReducer<T>;
  getState: (state: CombinedState) => ManagerState<T>;
  getItemMap: (state: CombinedState) => Map<string, Payload<T>>;
  sagaManager: SagaManager;
  addMappedChild: <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: Payload<U>) => Payload<T>,
    adaptFromParentToChild: (payload: Payload<T>) => Payload<U>
  ) => Manager<U>;
  // addFilteredChild: <U>(
  //   childManagerId: string,
  //   adaptFromChildToParent: (payload: U) => T,
  //   adaptFromParentToChild: (payload: T) => U
  // ) => Manager<U>;
  getChildren: () => readonly Manager<any>[];
  addValidator: (validate: Validator<T>) => void;
}>;

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
    destroy,
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

  const sagaManager = makeSagaManager();

  const validators: Set<Validator<T>> = new Set();

  const addValidator = (validate: Validator<T>) => {
    if (parentManagerId) {
      throw new Error(`A child manager cannot have validators: ${managerId}`);
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
    adaptFromChildToParent: (payload: Payload<U>) => Payload<T>,
    adaptFromParentToChild: (payload: Payload<T>) => Payload<U>
  ) => {
    // Use when listing a whole set of data: 1to1 correspondence.
    // Anything that happens to the parent in the background must be reflected in the child.
    // Anything that happens to the child through user interaction must be reflected in the parent.
    // So just delegate to the parent and propagate.
    const manager = makeManager<U>(childManagerId, managerId);
    const CHILD_CONSTS = makeManagerConstants(childManagerId);
    const {
      CREATE: CHILD_CREATE,
      DESTROY: CHILD_DESTROY,
      MODIFY: CHILD_MODIFY,
      DO_CREATE: CHILD_DO_CREATE,
      DO_DESTROY: CHILD_DO_DESTROY,
      DO_MODIFY: CHILD_DO_MODIFY,
      DO_SET: CHILD_DO_SET
    } = CHILD_CONSTS;
    const {
      doCreate: childDoCreate,
      doDestroy: childDoDestroy,
      doModify: childDoModify,
      doSet: childDoSet
    } = manager.actionCreators;

    manager.sagaManager.add(CHILD_CREATE, function* (): SagaGenerator {
      const { payload }: CreateAction<U> = yield take(CHILD_CREATE);
      yield put(create(adaptFromChildToParent(payload)));
    });

    manager.sagaManager.add(CHILD_DESTROY, function* (): SagaGenerator {
      const { itemId }: DestroyAction<U> = yield take(CHILD_DESTROY);
      yield put(destroy(itemId));
    });

    manager.sagaManager.add(CHILD_MODIFY, function* (): SagaGenerator {
      const { itemId, payload }: ModifyAction<U> = yield take(CHILD_MODIFY);
      yield put(modify(itemId, adaptFromChildToParent(payload)));
    });

    manager.sagaManager.add(CHILD_DO_CREATE, function* (): SagaGenerator {
      const { itemId, payload }: DoCreateAction<T> = yield take(DO_CREATE);
      yield put(childDoCreate(itemId, adaptFromParentToChild(payload)));
    });

    manager.sagaManager.add(CHILD_DO_DESTROY, function* (): SagaGenerator {
      const { itemId }: DoDestroyAction<T> = yield take(DO_DESTROY);
      yield put(childDoDestroy(itemId));
    });

    manager.sagaManager.add(CHILD_DO_MODIFY, function* (): SagaGenerator {
      const { itemId, payload }: DoModifyAction<T> = yield take(DO_MODIFY);
      yield put(childDoModify(itemId, adaptFromParentToChild(payload)));
    });

    manager.sagaManager.add(CHILD_DO_SET, function* (): SagaGenerator {
      const {
        payload: { items: payloadMap }
      }: DoSetAction<T> = yield take(DO_SET);
      const childPayloadMap: MutablePayloadMap<U> = {};

      for (let [itemId, payload] of Object.entries(payloadMap)) {
        childPayloadMap[itemId] = adaptFromParentToChild(payload);
      }

      yield put(childDoSet({ items: childPayloadMap, selections: {} }));
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
  //     const { payload }: { payload: U } = yield take(CHILD_CREATE);
  //     yield put({ type: CREATE, payload: adaptFromChildToParent(payload) });

  //     const {
  //       itemId,
  //       payload: parentPayload,
  //       errors
  //     }: { itemId: string; payload: T; errors: string[] } = yield take(
  //       DO_CREATE
  //     );
  //     yield put({
  //       type: CHILD_DO_CREATE,
  //       itemId,
  //       payload: adaptFromParentToChild(parentPayload, errors)
  //     });
  //   });

  //   manager.sagaManager.add(destroySagaName, function* (): SagaGenerator {
  //     const { itemId } = yield take([CHILD_DESTROY, DO_DESTROY]);
  //     yield put({ type: CHILD_DO_DESTROY, itemId });
  //   });

  //   manager.sagaManager.add(modifySagaName, function* (): SagaGenerator {
  //     const { itemId, payload }: { itemId: string; payload: U } = yield take(
  //       CHILD_MODIFY
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
  //       type: CHILD_DO_MODIFY,
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
    CONSTS,
    actionCreators,
    reducer,
    getState,
    getItemMap,
    sagaManager,
    addMappedChild,
    // addFilteredChild,
    getChildren,
    addValidator
  };
};
