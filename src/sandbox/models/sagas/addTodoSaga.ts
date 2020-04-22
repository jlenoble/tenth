import { SagaIterator } from "redux-saga";
import { put, take } from "redux-saga/effects";
import { tmpId, validateTitle } from "../todo";
import { ADD_TODO } from "../constants";
import { AddTodoAction } from "../actions";
import { doAddTodo } from "../action-creators";

export function* addTodoSaga(): SagaIterator {
  while (1) {
    const {
      meta: { viewId, title }
    }: AddTodoAction = yield take(ADD_TODO);
    const id = tmpId();
    const errors = validateTitle(title);

    yield put(
      doAddTodo({
        viewId,
        todo: errors.length
          ? {
              id,
              title,
              checked: false,
              validated: false,
              errors
            }
          : { id, title, checked: false, validated: true }
      })
    );
  }
}

export default addTodoSaga;
