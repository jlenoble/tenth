import { SagaIterator } from "redux-saga";
import { put, take, select } from "redux-saga/effects";
import { TodosState } from "../types";
import { EXPAND_TODO } from "../constants";
import { ExpandTodoAction } from "../actions";
import { addPart, addView } from "../action-creators";
import { updateSubView } from "../ui";

export function* expandTodoSaga(): SagaIterator {
  while (1) {
    const {
      meta: { viewId, id },
    }: ExpandTodoAction = yield take(EXPAND_TODO);
    const { views, parts }: TodosState = yield select(
      (state: { todos: TodosState }) => state.todos
    );
    const visibilityFilter = views[viewId].visibilityFilter;

    if (!parts[id]) {
      yield put(addPart({ partId: id }));
      yield put(addView({ viewId: id, partId: id, visibilityFilter }));
    }

    yield put(updateSubView({ subViewId: id }));
  }
}

export default expandTodoSaga;
