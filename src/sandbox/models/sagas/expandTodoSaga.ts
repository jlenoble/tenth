import { SagaIterator } from "redux-saga";
import { put, take, select } from "redux-saga/effects";
import { ExpandTodoAction, TodosState, addPart, addView } from "../todo";
import { EXPAND_TODO } from "../constants";
import { updateSubView } from "../ui";

export function* expandTodoSaga(): SagaIterator {
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

export default expandTodoSaga;
