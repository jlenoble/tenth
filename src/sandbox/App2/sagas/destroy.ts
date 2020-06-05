import { call, select, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import { DESTROY_ITEM, DestroyItemAction, getItem } from "../redux-reducers";
import { MetaAction } from "../types";

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
      const { items } = yield call(() => manager.reduxManager.destroyItem(id));

      yield call(() => manager.removeFromViews(items));
    }
  }
}
