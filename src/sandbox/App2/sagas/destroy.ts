import { call, select, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  DESTROY_ITEM,
  DestroyItemAction,
  getItem,
  DESTROY_ITEM_REVERT,
} from "../redux-reducers";
import { MetaAction, MaybePreOptimisticAction } from "../types";

export function* destroyItemSaga(): SagaGenerator {
  const action: MaybePreOptimisticAction<MetaAction<
    DestroyItemAction
  >> = yield take(DESTROY_ITEM);

  const {
    payload: { id },
    meta,
  } = action;
  const { manager, optimisticId } = meta;

  if (manager) {
    const item = yield select(getItem(id));

    if (item) {
      const { items, relationships } = yield call(() =>
        manager.reduxManager.destroyItem(id)
      );

      if (optimisticId) {
        manager.optimistManager.setUndoChange(Math.abs(optimisticId), {
          type: DESTROY_ITEM_REVERT,
          payload: {
            items,
            relationships,
          },
        });
      }

      yield call(() => manager.removeFromViews(items));
    }
  }
}
