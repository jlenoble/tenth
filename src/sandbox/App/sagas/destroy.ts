import { put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  Manager,
  ManagerRelationship,
  DestroyAction,
  DoDestroyAction
} from "../types";

export const addDestroySagas = <T, U>({
  manager,
  childManager,
  relationship
}: {
  manager: Manager<T>;
  childManager: Manager<U>;
  relationship: ManagerRelationship;
}) => {
  const {
    CONSTS: { DO_DESTROY },
    actionCreators: { destroy }
  } = manager;
  const {
    CONSTS: { DESTROY: CHILD_DESTROY, DO_DESTROY: CHILD_DO_DESTROY },
    actionCreators: { doDestroy: childDoDestroy },
    sagaManager
  } = childManager;

  switch (relationship) {
    case ManagerRelationship.MAP:
    case ManagerRelationship.FILTER: {
      sagaManager.add(CHILD_DESTROY, function* (): SagaGenerator {
        const { itemId }: DestroyAction<U> = yield take(CHILD_DESTROY);
        yield put(destroy(itemId));
      });

      sagaManager.add(CHILD_DO_DESTROY, function* (): SagaGenerator {
        const { itemId }: DoDestroyAction<T> = yield take(DO_DESTROY);
        yield put(childDoDestroy(itemId));
      });

      break;
    }

    case ManagerRelationship.SELECT: {
      break;
    }
  }
};
