import { put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  Manager,
  Payload,
  ManagerRelationship,
  ExpandAction,
  DoExpandAction,
} from "../types";

export const addExpandSagas = <T, U = T>({
  manager,
  childManager,
  relationship,
}: {
  manager: Manager<T>;
  childManager: Manager<U>;
  relationship: ManagerRelationship;
  adaptToChild?: (payload: Payload<T>) => Payload<U>;
  adaptToParent?: (payload: Payload<U>) => Payload<T>;
}) => {
  const {
    CONSTS: { DO_EXPAND },
    actionCreators: { expand },
  } = manager;

  const {
    CONSTS: { EXPAND: CHILD_EXPAND, DO_EXPAND: CHILD_DO_EXPAND },
    actionCreators: { doExpand: childDoExpand },
    sagaManager,
  } = childManager;

  switch (relationship) {
    case ManagerRelationship.MAP: {
      sagaManager.add(CHILD_EXPAND, function* (): SagaGenerator {
        const { itemId, expanded }: ExpandAction = yield take(CHILD_EXPAND);
        yield put(expand(itemId, expanded));
      });

      sagaManager.add(CHILD_DO_EXPAND, function* (): SagaGenerator {
        const { itemId, expanded }: DoExpandAction = yield take(DO_EXPAND);
        yield put(childDoExpand(itemId, expanded));
      });

      break;
    }

    case ManagerRelationship.FILTER: {
      sagaManager.add(CHILD_EXPAND, function* (): SagaGenerator {
        const { itemId, expanded }: ExpandAction = yield take(CHILD_EXPAND);
        yield put(expand(itemId, expanded));

        yield take(DO_EXPAND);
        yield put(childDoExpand(itemId, expanded));
      });

      break;
    }

    case ManagerRelationship.SELECT: {
      break;
    }
  }
};
