import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";
import addTodoSaga from "./addTodoSaga";
import expandTodoSaga from "./expandTodoSaga";
import resetTodosSaga from "./resetTodosSaga";
import updateTodoTitleSaga from "./updateTodoTitleSaga";

export function* mainSaga(): SagaIterator {
  yield fork(addTodoSaga);
  yield fork(expandTodoSaga);
  yield fork(resetTodosSaga);
  yield fork(updateTodoTitleSaga);
}

export default mainSaga;
