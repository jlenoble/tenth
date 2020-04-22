import { SagaIterator } from "redux-saga";
import { put, take } from "redux-saga/effects";
import { validateTitle } from "../todo";
import { UPDATE_TODO_TITLE } from "../constants";
import { UpdateTodoTitleAction } from "../actions";
import { doUpdateTodoTitle } from "../action-creators";

export function* updateTodoTitleSaga(): SagaIterator {
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

export default updateTodoTitleSaga;
