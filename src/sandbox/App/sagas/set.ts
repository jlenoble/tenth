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
  adaptToParent,
  selectionId
}: {
  manager: Manager<T>;
  childManager: Manager<U>;
  relationship: ManagerRelationship;
  adaptToChild?: (payload: Payload<T>) => Payload<U>;
  adaptToParent?: (payload: Payload<U>) => Payload<T>;
  selectionId?: string;
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
            payload: { items: payloadMap, selections }
          }: DoSetAction<T> = yield take(DO_SET);
          const childPayloadMap: MutablePayloadMap<U> = {};

          for (let [itemId, payload] of Object.entries(payloadMap)) {
            childPayloadMap[itemId] = adaptToChild(payload);
          }

          yield put(childDoSet({ items: childPayloadMap, selections }));
        });
      }

      break;
    }

    case ManagerRelationship.FILTER: {
      if (selectionId) {
        sagaManager.add(CHILD_DO_SET, function* (): SagaGenerator {
          const {
            payload: { items: payloadMap, selections }
          }: DoSetAction<U> = yield take(DO_SET);
          const childPayloadMap: MutablePayloadMap<U> = {};
          const selection = new Set(selections[selectionId] || []);

          for (let [itemId, payload] of Object.entries(payloadMap)) {
            if (!selection.size) {
              break;
            }

            if (selection.has(itemId)) {
              childPayloadMap[itemId] = payload;
              selection.delete(itemId);
            }
          }

          yield put(childDoSet({ items: childPayloadMap, selections }));
        });
      }

      break;
    }

    case ManagerRelationship.SELECT: {
      break;
    }
  }
};
