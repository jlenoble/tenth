import { select, take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import { getCurrentPath } from "../redux-reducers";
import * as Consts from "../redux-reducers/current-path/consts";
import { ItemId } from "../types";

export function* saveCurrentPathSaga(): SagaGenerator {
  yield take(Object.keys(Consts));
  const currentPath: ItemId[] = yield select(getCurrentPath);
  localStorage.setItem("currentPath", JSON.stringify(currentPath));
}
