import { put, select, takeLatest } from "redux-saga/effects";
import { validateTitle, rootId } from "../todo";
import { Todo, TodoMap, TodoStates, TodosState, PartMap } from "../types";
import {
  DO_ADD_TODO,
  DO_UPDATE_TODO_TITLE,
  DELETE_TODO,
  TOGGLE_TODO,
  MOVE_TODO
} from "../constants";
import { setTodosNoSave, addView } from "../action-creators";
import { todosInitialState } from "../reducers";

function* loadFromLocalStorage(localStorageId: string) {
  const { todos, parts } = JSON.parse(
    localStorage.getItem(localStorageId) || `{"todos":{},"parts":{}}`
  ) as { todos: TodoMap; parts: PartMap };
  const visibilityFilter = todosInitialState.views[rootId].visibilityFilter;

  for (let [id, ids] of Object.entries(parts)) {
    yield put(
      addView({
        viewId: id,
        partId: id,
        visibilityFilter
      })
    );

    yield put(
      setTodosNoSave({
        partId: id,
        todos: ids
          .filter((id) => todos[id])
          .map((id) => {
            const todo = todos[id]!;
            const errors = validateTitle(todo.title);

            return errors.length
              ? {
                  id,
                  title: todo.title,
                  checked: todo.completed,
                  validated: false,
                  errors
                }
              : {
                  id,
                  title: todo.title,
                  checked: todo.completed,
                  validated: true
                };
          }) as TodoStates
      })
    );
  }
}

function* saveToLocalStorage(localStorageId: string) {
  const { todos, parts }: TodosState = yield select(
    (state: { todos: TodosState }) => state.todos
  );

  localStorage.setItem(
    localStorageId,
    JSON.stringify({
      todos: Object.entries(todos).reduce((map, [id, todo]) => {
        map[id] = {
          title: todo.title,
          completed: todo.checked
        };
        return map;
      }, {} as { [id: string]: Omit<Todo, "id"> }) as TodoMap,
      parts: Object.entries(parts).reduce((map, [partId, todosStates]) => {
        if (todosStates.length) {
          map[partId] = todosStates.map((todo) => todo.id);
        }
        return map;
      }, {} as { [id: string]: readonly string[] }) as PartMap
    })
  );
}

function* enableSaveToLocalStorage(localStorageId: string) {
  yield takeLatest(
    [DO_ADD_TODO, DO_UPDATE_TODO_TITLE, DELETE_TODO, TOGGLE_TODO, MOVE_TODO],
    saveToLocalStorage,
    localStorageId
  );
}

export function* enableLocalStorageSaga(localStorageId: string) {
  yield loadFromLocalStorage(localStorageId);
  yield enableSaveToLocalStorage(localStorageId);
}
export default enableLocalStorageSaga;
