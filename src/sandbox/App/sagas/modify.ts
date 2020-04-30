import { put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  Manager,
  Payload,
  ManagerRelationship,
  ModifyAction,
  DoModifyAction
} from "../types";

export const addModifySagas = <T, U>({
  manager,
  childManager,
  relationship,
  adaptToChild,
  adaptToParent
}: {
  manager: Manager<T>;
  childManager: Manager<U>;
  relationship: ManagerRelationship;
  adaptToChild?: (payload: Payload<T>) => Payload<U>;
  adaptToParent?: (payload: Payload<U>) => Payload<T>;
}) => {
  const {
    CONSTS: { DO_MODIFY },
    actionCreators: { modify }
  } = manager;
  const {
    CONSTS: { MODIFY: CHILD_MODIFY, DO_MODIFY: CHILD_DO_MODIFY },
    actionCreators: { doModify: childDoModify },
    sagaManager
  } = childManager;

  switch (relationship) {
    case ManagerRelationship.MAP: {
      if (adaptToParent && adaptToChild) {
        sagaManager.add(CHILD_MODIFY, function* (): SagaGenerator {
          const { itemId, payload }: ModifyAction<U> = yield take(CHILD_MODIFY);
          yield put(modify(itemId, adaptToParent(payload)));
        });

        sagaManager.add(CHILD_DO_MODIFY, function* (): SagaGenerator {
          const { itemId, payload }: DoModifyAction<T> = yield take(DO_MODIFY);
          yield put(childDoModify(itemId, adaptToChild(payload)));
        });
      }

      break;
    }

    case ManagerRelationship.FILTER: {
      sagaManager.add(CHILD_MODIFY, function* (): SagaGenerator {
        const { itemId, payload }: ModifyAction<T> = yield take(CHILD_MODIFY);
        yield put(modify(itemId, payload));
      });

      sagaManager.add(CHILD_DO_MODIFY, function* (): SagaGenerator {
        const { itemId, payload }: DoModifyAction<U> = yield take(DO_MODIFY);
        yield put(childDoModify(itemId, payload));
      });

      break;
    }

    case ManagerRelationship.SELECT: {
      break;
    }
  }
};
