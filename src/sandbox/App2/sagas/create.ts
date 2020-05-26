import { put, take } from "redux-saga/effects";
import { OptimisticAction, BEGIN, COMMIT } from "redux-optimistic-ui";
import { SagaGenerator } from "../../../generics";
import {
  ADD_RELATIONSHIP,
  AddRelationshipAction,
  addRelationship,
  ADD_RELATIONSHIPS,
  AddRelationshipsAction,
  removeRelationship,
  CREATE_RELATED_ITEM,
  CreateRelatedItemAction,
} from "../redux-reducers";
import { Ids } from "../types";

export function* addRelationshipSaga(): SagaGenerator {
  const { payload: ids }: AddRelationshipAction = yield take(ADD_RELATIONSHIP);
}

export function* addRelationshipsSaga(): SagaGenerator {
  const { payload: relationships }: AddRelationshipsAction = yield take(
    ADD_RELATIONSHIPS
  );
}

export function* createRelatedItemSaga(): SagaGenerator {
  const action: CreateRelatedItemAction = yield take(CREATE_RELATED_ITEM);

  const {
    payload: {
      relationship: { id, ids },
    },
    meta: { optimisticId, manager },
  } = action;

  if (id < 0) {
    const optimisticAction: AddRelationshipAction & OptimisticAction = {
      ...addRelationship([ids[0], ids[1], optimisticId]),
      meta: { optimistic: { type: BEGIN, id: optimisticId } },
    };

    yield put(optimisticAction);
  } else {
    yield put(removeRelationship([ids[0], ids[1], optimisticId]));

    const optimisticAction: AddRelationshipAction & OptimisticAction = {
      ...addRelationship(ids as Ids),
      meta: { optimistic: { type: COMMIT, id: optimisticId } },
    };

    yield put(optimisticAction);
  }

  manager.addRelatedItem(action.payload);
}
