import { put, select, take } from "redux-saga/effects";
import { OptimisticAction, BEGIN, REVERT } from "redux-optimistic-ui";
import { SagaGenerator } from "../../../generics";
import {
  RemoveRelationshipsForItemAction,
  removeRelationshipsForItem,
  DESTROY_ITEM,
  DestroyItemAction,
  getRelationshipsForRightItem,
} from "../redux-reducers";
import { Ids } from "../types";

export function* destroyItemSaga(): SagaGenerator {
  const action: DestroyItemAction = yield take(DESTROY_ITEM);

  const {
    payload: { id },
    meta: { optimisticId, begin, manager },
  } = action;

  let forRight: Ids[] = yield select(getRelationshipsForRightItem(id));

  const optimisticAction: RemoveRelationshipsForItemAction &
    OptimisticAction = {
    ...removeRelationshipsForItem(forRight),
    meta: { optimistic: { type: begin ? BEGIN : REVERT, id: optimisticId } },
  };

  yield put(optimisticAction);

  if (!begin) {
    forRight = yield select(getRelationshipsForRightItem(id));
    yield put(removeRelationshipsForItem(forRight));
  }

  for (const ids of forRight) {
    manager._removeRelatedItem({ relationship: { ids } });
  }
}
