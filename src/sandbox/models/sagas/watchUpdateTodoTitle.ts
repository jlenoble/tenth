import { SagaIterator } from "redux-saga";
import { put, take } from "redux-saga/effects";
import {
  UpdateTodoTitleAction,
  UPDATE_TODO_TITLE,
  validateTitle,
  doUpdateTodoTitle
} from "../todo";

export function* watchUpdateTodoTitle(): SagaIterator {
  while (1) {
    const {
      meta: { viewId, id, title }
    }: UpdateTodoTitleAction = yield take(UPDATE_TODO_TITLE);
    const errors = validateTitle(title);

    yield put(
      doUpdateTodoTitle({
        viewId,
        todo: errors.length
          ? {
              id,
              title,
              validated: false,
              errors
            }
          : {
              id,
              title,
              validated: true
            }
      })
    );
  }
}

export default watchUpdateTodoTitle;
