import { call, select, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  TRIGGER_DESTROY_ITEM,
  TriggerDestroyItemAction,
  getItem,
  revertDestroyItem,
} from "../redux-reducers";
import {
  ItemId,
  ClientItem,
  ClientRelationship,
  MetaAction,
  MaybePreOptimisticAction,
} from "../types";

export function* destroyItemSaga(): SagaGenerator {
  const action: MaybePreOptimisticAction<MetaAction<
    TriggerDestroyItemAction
  >> = yield take(TRIGGER_DESTROY_ITEM);

  const {
    payload: { id },
    meta,
  } = action;
  const { manager, optimisticId } = meta;

  if (manager) {
    const item = yield select(getItem(id));

    if (item) {
      const {
        items,
        relationships,
        inaccessible,
      }: {
        item: ClientItem;
        items: ClientItem[];
        relationships: ClientRelationship[];
        inaccessible: ItemId[];
      } = yield call(() => manager.reduxManager.destroyItem(id));

      if (optimisticId) {
        manager.optimistManager.setUndoChange(
          Math.abs(optimisticId),
          revertDestroyItem({
            items,
            relationships,
          })
        );
      }

      console.log(inaccessible);

      yield call(() => manager.removeFromViews(items));
    }
  }
}
