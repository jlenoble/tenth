import { SagaIterator } from "redux-saga";
import { fork, put, takeEvery } from "redux-saga/effects";
import watchAddTodo from "./watchAddTodo";
import watchExpandTodo from "./watchExpandTodo";
import watchUpdateTodoTitle from "./watchUpdateTodoTitle";
import {
  RESET_TODOS,
  ResetTodosAction,
  addView,
  setTodos,
  validateTitle,
  TodoStates
} from "../todo";

export function* watchAll(): SagaIterator {
  yield fork(watchAddTodo);
  yield fork(watchExpandTodo);
  yield fork(watchUpdateTodoTitle);

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

export default watchAll;
