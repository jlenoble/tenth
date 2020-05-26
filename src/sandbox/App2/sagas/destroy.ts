import { take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  REMOVE_RELATIONSHIP,
  RemoveRelationshipAction,
  REMOVE_RELATIONSHIPS,
  RemoveRelationshipsAction,
  DESTROY_ITEM,
  DestroyItemAction,
} from "../redux-reducers";

export function* removeRelationshipSaga(): SagaGenerator {
  const { payload: ids }: RemoveRelationshipAction = yield take(
    REMOVE_RELATIONSHIP
  );
}

export function* removeRelationshipsSaga(): SagaGenerator {
  const { payload: relationships }: RemoveRelationshipsAction = yield take(
    REMOVE_RELATIONSHIPS
  );
}

export function* destroyItemSaga(): SagaGenerator {
  const { payload: item }: DestroyItemAction = yield take(DESTROY_ITEM);
}
