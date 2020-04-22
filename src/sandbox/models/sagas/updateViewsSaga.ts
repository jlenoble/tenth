import { SagaIterator } from "redux-saga";
import { put, select, takeLatest } from "redux-saga/effects";
import { TodosState } from "../types";
import {
  SET_TODOS,
  SET_TODOS_NOSAVE,
  DO_ADD_TODO,
  DO_UPDATE_TODO_TITLE,
  DELETE_TODO,
  TOGGLE_TODO,
  MOVE_TODO
} from "../constants";
import {
  DoAddTodoAction,
  DoUpdateTodoTitleAction,
  DeleteTodoAction,
  ToggleTodoAction,
  MoveTodoAction,
  SetTodosAction,
  SetTodosNoSaveAction
} from "../actions";
import { updateViews } from "../action-creators";

export function* updateViewsSaga() {
  yield takeLatest(
    [DO_ADD_TODO, DO_UPDATE_TODO_TITLE, DELETE_TODO, TOGGLE_TODO, MOVE_TODO],
    function* (
      action:
        | DoAddTodoAction
        | DoUpdateTodoTitleAction
        | DeleteTodoAction
        | ToggleTodoAction
        | MoveTodoAction
    ): SagaIterator {
      const {
        views: {
          [action.meta.viewId]: { partId }
        }
      }: TodosState = yield select(
        (state: { todos: TodosState }) => state.todos
      );
      yield put(updateViews({ partId }));
    }
  );

  yield takeLatest([SET_TODOS, SET_TODOS_NOSAVE], function* (
    action: SetTodosAction | SetTodosNoSaveAction
  ): SagaIterator {
    yield put(updateViews(action.meta));
  });
}

export default updateViewsSaga;
