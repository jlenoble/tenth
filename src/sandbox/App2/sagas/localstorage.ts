import { select, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import { getCurrentPath, getNCards } from "../redux-reducers";
import * as CurrentPath from "../redux-reducers/current-path/consts";
import * as NCards from "../redux-reducers/ncards/consts";
import { ItemId } from "../types";

export function* saveCurrentPathSaga(): SagaGenerator {
  yield take(Object.keys(CurrentPath));
  const currentPath: ItemId[] = yield select(getCurrentPath);
  localStorage.setItem("currentPath", JSON.stringify(currentPath));
}

export function* saveNCardsSaga(): SagaGenerator {
  yield take(Object.keys(NCards));
  const nCards: number = yield select(getNCards);
  localStorage.setItem("nCards", JSON.stringify(nCards));
}
