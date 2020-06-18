import { call, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  TRIGGER_CREATE_RELATED_ITEM,
  TRIGGER_CREATE_ORDERED_ITEM,
  TriggerCreateRelatedItemAction,
  TriggerCreateOrderedItemAction,
} from "../redux-reducers";
import { MetaAction } from "../types";

export function* createRelatedItemSaga(): SagaGenerator {
  const action: MetaAction<TriggerCreateRelatedItemAction> = yield take(
    TRIGGER_CREATE_RELATED_ITEM
  );

  const {
    payload: { item, relationship },
    meta,
  } = action;
  const manager = meta?.manager;

  if (manager) {
    yield call(() => manager.addRelatedItem(item, relationship));
  }
}

export function* createOrderedItemSaga(): SagaGenerator {
  const action: MetaAction<TriggerCreateOrderedItemAction> = yield take(
    TRIGGER_CREATE_ORDERED_ITEM
  );

  const {
    payload: { item, order, relationships },
    meta,
  } = action;
  const manager = meta?.manager;

  if (manager) {
    console.log(item, order, relationships);
    // yield call(() => manager.addOrderedItem(item, relationship));
  }
}
