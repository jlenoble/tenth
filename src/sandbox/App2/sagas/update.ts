import { call, select, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  TRIGGER_UPDATE_ITEM,
  TriggerUpdateItemAction,
  getItem,
  revertUpdateItem,
} from "../redux-reducers";
import { MetaAction, MaybePreOptimisticAction, ClientItem } from "../types";

export function* updateItemSaga(): SagaGenerator {
  const action: MaybePreOptimisticAction<MetaAction<
    TriggerUpdateItemAction
  >> = yield take(TRIGGER_UPDATE_ITEM);

  const {
    payload: { id, title },
    meta,
  } = action;
  const { manager, optimisticId } = meta;

  if (manager) {
    let item: ClientItem = yield select(getItem(id));

    if (item) {
      item = yield call(() =>
        manager.reduxManager.updateItem({ ...item, title })
      );

      if (optimisticId) {
        manager.optimistManager.setUndoChange(
          Math.abs(optimisticId),
          revertUpdateItem(item)
        );
      }
    }
  }
}
