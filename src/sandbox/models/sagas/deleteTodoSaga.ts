import { SagaIterator } from "redux-saga";
import { put, take } from "redux-saga/effects";
import { DELETE_TODO } from "../constants";
import { DeleteTodoAction } from "../actions";
// import { doDeleteTodo } from "../action-creators";
import { deleteTodo } from "../action-creators";

export function* deleteTodoSaga(): SagaIterator {
  while (1) {
    const {
      meta: { viewId, id }
    }: DeleteTodoAction = yield take(DELETE_TODO);

    yield put(deleteTodo({ viewId, id }));
    // yield put(doDeleteTodo({ viewId, id }));
  }
}

export default deleteTodoSaga;
