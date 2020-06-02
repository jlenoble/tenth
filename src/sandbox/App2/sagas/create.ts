import { call, put, select, take } from "redux-saga/effects";
import { OptimisticAction, BEGIN, REVERT } from "redux-optimistic-ui";
import { SagaGenerator } from "../../../generics";
import {
  AddRelationshipForItemAction,
  addRelationshipForItem,
  CREATE_RELATED_ITEM,
  CreateRelatedItemAction,
} from "../redux-reducers";
import { Ids, MetaAction } from "../types";

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
