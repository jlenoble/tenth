import { put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  Manager,
  Payload,
  ManagerRelationship,
  CreateAction,
  DoCreateAction,
} from "../types";

export const addCreateSagas = <T, U = T>({
  manager,
  childManager,
  relationship,
  adaptToChild,
  adaptToParent,
}: {
  manager: Manager<T>;
  childManager: Manager<U>;
  relationship: ManagerRelationship;
  adaptToChild?: (payload: Payload<T>) => Payload<U>;
  adaptToParent?: (payload: Payload<U>) => Payload<T>;
}) => {
  const {
    CONSTS: { DO_CREATE },
    actionCreators: { create },
  } = manager;

  const {
    CONSTS: { CREATE: CHILD_CREATE, DO_CREATE: CHILD_DO_CREATE },
    actionCreators: { doCreate: childDoCreate },
    sagaManager,
  } = childManager;

  switch (relationship) {
    case ManagerRelationship.MAP: {
      if (adaptToParent && adaptToChild) {
        sagaManager.add(CHILD_CREATE, function* (): SagaGenerator {
          const { payload }: CreateAction<U> = yield take(CHILD_CREATE);
          yield put(create(adaptToParent(payload)));
        });

        sagaManager.add(CHILD_DO_CREATE, function* (): SagaGenerator {
          const { itemId, payload }: DoCreateAction<T> = yield take(DO_CREATE);
          yield put(childDoCreate(itemId, adaptToChild(payload)));
        });
      }

      break;
    }

    case ManagerRelationship.FILTER: {
      sagaManager.add(CHILD_CREATE, function* (): SagaGenerator {
        const { payload: childPayload }: CreateAction<T> = yield take(
          CHILD_CREATE
        );
        yield put(create(childPayload));

        const { itemId, payload }: DoCreateAction<U> = yield take(DO_CREATE);
        yield put(childDoCreate(itemId, payload));
      });

      break;
    }

    case ManagerRelationship.SELECT: {
      break;
    }
  }
};
