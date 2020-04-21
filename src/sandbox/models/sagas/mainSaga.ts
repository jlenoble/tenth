import { SagaIterator } from "redux-saga";
import { fork, put, takeEvery } from "redux-saga/effects";
import addTodoSaga from "./addTodoSaga";
import expandTodoSaga from "./expandTodoSaga";
import updateTodoTitleSaga from "./updateTodoTitleSaga";
import {
  RESET_TODOS,
  ResetTodosAction,
  addView,
  setTodos,
  validateTitle
} from "../todo";
import { TodoStates } from "../types";

export function* mainSaga(): SagaIterator {
  yield fork(addTodoSaga);
  yield fork(expandTodoSaga);
  yield fork(updateTodoTitleSaga);

  yield takeEvery(RESET_TODOS, function* ({
    meta: { partId, todos }
  }: ResetTodosAction) {
    yield put(
      addView({
        viewId: partId,
        partId
      })
    );
    yield put(
      setTodos({
        partId,
        todos: todos.map((todo) => {
          const errors = validateTitle(todo.title);
          return errors.length
            ? {
                id: todo.id,
                title: todo.title,
                checked: todo.completed,
                validated: false,
                errors
              }
            : {
                id: todo.id,
                title: todo.title,
                checked: todo.completed,
                validated: true
              };
        }) as TodoStates
      })
    );
  });
}

export default mainSaga;
