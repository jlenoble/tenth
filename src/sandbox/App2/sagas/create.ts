import { put, take } from "redux-saga/effects";
import { OptimisticAction, BEGIN, REVERT } from "redux-optimistic-ui";
import { SagaGenerator } from "../../../generics";
import {
  AddRelationshipAction,
  addRelationship,
  CREATE_RELATED_ITEM,
  CreateRelatedItemAction,
} from "../redux-reducers";
import { Ids } from "../types";

export function* createRelatedItemSaga(): SagaGenerator {
  const action: CreateRelatedItemAction = yield take(CREATE_RELATED_ITEM);

  const {
    payload: {
      relationship: { ids },
    },
    meta: { optimisticId, begin, manager },
  } = action;

  const optimisticAction: AddRelationshipAction & OptimisticAction = {
    ...addRelationship([ids[0], ids[1], optimisticId]),
    meta: { optimistic: { type: begin ? BEGIN : REVERT, id: optimisticId } },
  };

  yield put(optimisticAction);

  if (!begin) {
    yield put(addRelationship(ids as Ids));
  }

  manager._addRelatedItem(action.payload);
}
