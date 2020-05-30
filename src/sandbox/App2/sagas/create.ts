import { put, take } from "redux-saga/effects";
import { OptimisticAction, BEGIN, REVERT } from "redux-optimistic-ui";
import { SagaGenerator } from "../../../generics";
import {
  AddRelationshipForItemAction,
  addRelationshipForItem,
  CREATE_RELATED_ITEM,
  CreateRelatedItemAction,
} from "../redux-reducers";
import { Ids } from "../types";

export function* createRelatedItemSaga(): SagaGenerator {
  const action: CreateRelatedItemAction = yield take(CREATE_RELATED_ITEM);

  const {
    payload: { item, relationship },
    meta: { optimisticId, begin, manager },
  } = action;
  const { ids } = relationship;

  const optimisticAction: AddRelationshipForItemAction & OptimisticAction = {
    ...addRelationshipForItem([ids[0], ids[1], optimisticId]),
    meta: { optimistic: { type: begin ? BEGIN : REVERT, id: optimisticId } },
  };

  yield put(optimisticAction);

  if (!begin) {
    yield put(addRelationshipForItem(ids as Ids));
  }

  manager._addRelatedItem(item, relationship);
}
