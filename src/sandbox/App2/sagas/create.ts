import { call, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  CREATE_RELATED_ITEM,
  CreateRelatedItemAction,
} from "../redux-reducers";
import { MetaAction } from "../types";

export function* createRelatedItemSaga(): SagaGenerator {
  const action: MetaAction<CreateRelatedItemAction> = yield take(
    CREATE_RELATED_ITEM
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
