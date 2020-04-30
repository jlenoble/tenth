import { put, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  Manager,
  Payload,
  ManagerRelationship,
  DoSetAction,
  MutablePayloadMap
} from "../types";

export const addSetSagas = <T, U>({
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
    CONSTS: { DO_SET }
  } = manager;
  const {
    CONSTS: { DO_SET: CHILD_DO_SET },
    actionCreators: { doSet: childDoSet },
    sagaManager
  } = childManager;

  switch (relationship) {
    case ManagerRelationship.MAP: {
      if (adaptToParent && adaptToChild) {
        sagaManager.add(CHILD_DO_SET, function* (): SagaGenerator {
          const {
            payload: { items: payloadMap }
          }: DoSetAction<T> = yield take(DO_SET);
          const childPayloadMap: MutablePayloadMap<U> = {};

          for (let [itemId, payload] of Object.entries(payloadMap)) {
            childPayloadMap[itemId] = adaptToChild(payload);
          }

          yield put(childDoSet({ items: childPayloadMap, selections: {} }));
        });
      }
      break;
    }

    case ManagerRelationship.FILTER: {
      break;
    }

    case ManagerRelationship.SELECT: {
      break;
    }
  }
};
