import { call, put, select, take } from "redux-saga/effects";
import { OptimisticAction, BEGIN, REVERT } from "redux-optimistic-ui";
import { SagaGenerator } from "../../../generics";
import {
  DESTROY_ITEM,
  DestroyItemAction,
  getItem,
  getViewsForItem,
} from "../redux-reducers";
import { Ids, MetaAction } from "../types";

export function* destroyItemSaga(): SagaGenerator {
  const action: MetaAction<DestroyItemAction> = yield take(DESTROY_ITEM);

  const {
    payload: { id },
    meta,
  } = action;
  const manager = meta?.manager;

  if (manager) {
    const item = yield select(getItem(id));

    if (item) {
      const { items, relationships } = yield call(() =>
        manager.redux.destroyItem(id)
      );

      yield call(() => manager.removeFromViews(items));
    }
  }
}
