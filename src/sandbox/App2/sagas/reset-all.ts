import { call, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import { RESET_ALL, ResetAllAction } from "../redux-reducers";
import { MetaAction } from "../types";

export function* resetAllSaga(): SagaGenerator {
  const action: MetaAction<ResetAllAction> = yield take(RESET_ALL);

  const {
    payload: { views, state },
    meta,
  } = action;
  const manager = meta?.manager;

  if (manager) {
    yield call(() => manager.resetViews(views, state));
  }
}
