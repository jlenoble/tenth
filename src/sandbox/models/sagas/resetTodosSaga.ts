import { SagaIterator } from "redux-saga";
import { put, take } from "redux-saga/effects";
import { validateTitle, rootId } from "../todo";
import { TodoStates } from "../types";
import { RESET_TODOS } from "../constants";
import { ResetTodosAction } from "../actions";
import { setTodos, addView } from "../action-creators";
import { todosInitialState } from "../reducers";

export function* resetTodosSaga(): SagaIterator {
  while (1) {
    const {
      meta: { partId, todos }
    }: ResetTodosAction = yield take(RESET_TODOS);

    yield put(
      addView({
        viewId: partId,
        partId,
        visibilityFilter: todosInitialState.views[rootId].visibilityFilter
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
  }
}

export default resetTodosSaga;
