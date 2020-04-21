import { SagaIterator } from "redux-saga";
import { put, take, select } from "redux-saga/effects";
import {
  ExpandTodoAction,
  EXPAND_TODO,
  TodosState,
  addPart,
  addView
} from "../todo";
import { updateSubView } from "../ui";

export function* watchExpandTodo(): SagaIterator {
  while (1) {
    const {
      meta: { id }
    }: ExpandTodoAction = yield take(EXPAND_TODO);
    const { parts }: TodosState = yield select(
      (state: { todos: TodosState }) => state.todos
    );

    if (!parts[id]) {
      yield put(addPart({ partId: id }));
      yield put(addView({ viewId: id, partId: id }));
    }

    yield put(updateSubView({ subViewId: id }));
  }
}

export default watchExpandTodo;
