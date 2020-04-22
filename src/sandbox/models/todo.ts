import { SagaIterator } from "redux-saga";
import { put, select, takeLatest } from "redux-saga/effects";
import {
  VisibilityFilter,
  TodoStates,
  TodoStateMap,
  View,
  ViewMap
} from "./types";
import {
  SET_TODOS,
  SET_TODOS_NOSAVE,
  DO_ADD_TODO,
  DO_UPDATE_TODO_TITLE,
  DELETE_TODO,
  TOGGLE_TODO,
  MOVE_TODO,
  ADD_PART,
  ADD_VIEW,
  UPDATE_VIEWS,
  SET_VISIBILITY_FILTER
} from "./constants";
import {
  TodoActions,
  DoAddTodoAction,
  DoUpdateTodoTitleAction,
  DeleteTodoAction,
  ToggleTodoAction,
  MoveTodoAction,
  SetTodosAction,
  SetTodosNoSaveAction
} from "./actions";

export type TodosState = Readonly<{
  todos: TodoStateMap;
  views: ViewMap<"todos", TodoStates>;
  parts: Readonly<{ [id: string]: TodoStates }>;
}>;

interface AddPartAction {
  type: typeof ADD_PART;
  meta: { partId: string };
}

interface AddViewAction {
  type: typeof ADD_VIEW;
  meta: { viewId: string; partId: string };
}
interface UpdateViewsAction {
  type: typeof UPDATE_VIEWS;
  meta: { partId: string };
}
interface SetVisibilityFilterAction {
  type: typeof SET_VISIBILITY_FILTER;
  meta: { viewId: string; visibilityFilter: VisibilityFilter };
}

export type TodoActionType =
  | TodoActions
  | AddPartAction
  | AddViewAction
  | UpdateViewsAction
  | SetVisibilityFilterAction;

export const addPart = (meta: { partId: string }): TodoActionType => {
  return {
    type: ADD_PART,
    meta
  };
};

export const addView = (meta: {
  viewId: string;
  partId: string;
}): TodoActionType => {
  return {
    type: ADD_VIEW,
    meta
  };
};
export const updateViews = (meta: { partId: string }): TodoActionType => {
  return {
    type: UPDATE_VIEWS,
    meta
  };
};
export const setVisibilityFilter = (meta: {
  viewId: string;
  visibilityFilter: VisibilityFilter;
}): TodoActionType => {
  return {
    type: SET_VISIBILITY_FILTER,
    meta
  };
};

export const rootId = "ROOT";

export const makeView = (
  partId: string,
  visibilityFilter: VisibilityFilter,
  todos: TodoStates
) => {
  let view: View<"todos", TodoStates>;

  switch (visibilityFilter) {
    case VisibilityFilter.SHOW_ACTIVE:
      view = {
        partId,
        visibilityFilter,
        todos: todos.filter((todo) => !todo.checked)
      };
      break;

    case VisibilityFilter.SHOW_COMPLETED:
      view = {
        partId,
        visibilityFilter,
        todos: todos.filter((todo) => todo.checked)
      };
      break;

    case VisibilityFilter.SHOW_INVALID:
      view = {
        partId,
        visibilityFilter,
        todos: todos.filter((todo) => !todo.validated)
      };
      break;

    case VisibilityFilter.SHOW_ALL:
    default:
      view = { partId, visibilityFilter, todos };
      break;
  }

  return view;
};

let currentId = Date.now();
export const tmpId = () => "todo" + currentId++;

export const validateTitle = (title: string) => {
  const errors: string[] = [];

  if (title === "") {
    errors.push("Empty string");
  }

  return errors;
};

export function* watchVisibilityFilter() {
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

export const getTodos = (state: { todos: TodosState }): TodosState =>
  state.todos;
