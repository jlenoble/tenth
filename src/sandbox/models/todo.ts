import { SagaIterator } from "redux-saga";
import { fork, put, take, select, takeLatest } from "redux-saga/effects";
import { DropResult } from "react-beautiful-dnd";
import { VisibilityFilter, SET_VISIBILITY_FILTER } from "./visibility";

export type Todo = Readonly<{
  id: string;
  title: string;
  completed: boolean;
}>;

export type Todos = readonly Todo[];

export type TodoState = Readonly<{
  id: string;
  title: string;
  checked: boolean;
  validated: boolean;
  errors?: readonly string[];
}>;

export type TodoStates = readonly TodoState[];

export type TodosView = TodoStates;
export type TodosViews = Readonly<{ [viewId: string]: TodosView }>;

export type TodosState = Readonly<{
  todos: TodoStates;
  views: TodosViews;
}>;

const SET_TODOS = "SET_TODOS";
const SET_TODOS_NOSAVE = "SET_TODOS_NOSAVE";
const SET_VIEW = "SET_VIEW";

const ADD_TODO = "ADD_TODO";
const UPDATE_TODO_TITLE = "UPDATE_TODO_TITLE";
const RESET_TODOS = "RESET_TODOS";

const DELETE_TODO = "DELETE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const MOVE_TODO = "MOVE_TODO";

interface SetTodosAction {
  type: typeof SET_TODOS;
  meta: { viewId: string; todos: TodoStates };
}
interface SetTodosNoSaveAction {
  type: typeof SET_TODOS_NOSAVE;
  meta: { viewId: string; todos: TodoStates };
}
interface SetViewAction {
  type: typeof SET_VIEW;
  meta: { viewId: string; view: TodosView };
}

interface AddTodoAction {
  type: typeof ADD_TODO;
  meta: { viewId: string; title: string };
}
interface UpdateTodoTitleAction {
  type: typeof UPDATE_TODO_TITLE;
  meta: { viewId: string; id: string; title: string };
}
interface ResetTodosAction {
  type: typeof RESET_TODOS;
  meta: { viewId: string; todos: Todos };
}

interface TodoDeleteAction {
  type: typeof DELETE_TODO;
  meta: { viewId: string; id: string };
}
interface TodoToggleAction {
  type: typeof TOGGLE_TODO;
  meta: { viewId: string; id: string };
}
interface TodoMoveAction {
  type: typeof MOVE_TODO;
  meta: { viewId: string; dropResult: DropResult };
}

type TodoActionType =
  | SetTodosAction
  | SetTodosNoSaveAction
  | SetViewAction
  | AddTodoAction
  | UpdateTodoTitleAction
  | ResetTodosAction
  | TodoDeleteAction
  | TodoToggleAction
  | TodoMoveAction;

const setTodos = (meta: {
  viewId: string;
  todos: TodoStates;
}): TodoActionType => {
  return {
    type: SET_TODOS,
    meta
  };
};
const setTodosNoSave = (meta: {
  viewId: string;
  todos: TodoStates;
}): TodoActionType => {
  return {
    type: SET_TODOS_NOSAVE,
    meta
  };
};
const setView = (meta: { viewId: string; view: TodosView }): TodoActionType => {
  return {
    type: SET_VIEW,
    meta
  };
};

export const addTodo = (meta: {
  viewId: string;
  title: string;
}): TodoActionType => {
  return {
    type: ADD_TODO,
    meta
  };
};
export const updateTodoTitle = (meta: {
  viewId: string;
  id: string;
  title: string;
}): TodoActionType => {
  return {
    type: UPDATE_TODO_TITLE,
    meta
  };
};
export const resetTodos = (meta: {
  viewId: string;
  todos: Todos;
}): TodoActionType => {
  return {
    type: RESET_TODOS,
    meta
  };
};

export const deleteTodo = (meta: {
  viewId: string;
  id: string;
}): TodoActionType => {
  return {
    type: DELETE_TODO,
    meta
  };
};
export const toggleTodo = (meta: {
  viewId: string;
  id: string;
}): TodoActionType => {
  return {
    type: TOGGLE_TODO,
    meta
  };
};
export const moveTodo = (meta: {
  viewId: string;
  dropResult: DropResult;
}): TodoActionType => {
  return {
    type: MOVE_TODO,
    meta
  };
};

export const rootId = "ROOT";
const initialState: TodosState = { todos: [], views: { [rootId]: [] } };

export const todos = (
  state = initialState,
  action: TodoActionType
): TodosState => {
  switch (action.type) {
    case SET_TODOS:
    case SET_TODOS_NOSAVE:
      return { ...state, todos: action.meta.todos };

    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.meta.id)
      };

    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id !== action.meta.id
            ? todo
            : { ...todo, checked: !todo.checked }
        )
      };

    case MOVE_TODO: {
      const viewId = action.meta.viewId;
      const { source, destination } = action.meta.dropResult;

      if (!destination) {
        return state;
      }

      if (destination.droppableId === source.droppableId) {
        if (destination.index === source.index) {
          return state;
        }

        const newTodos = state.todos.concat();

        const sId = state.views[viewId][source.index].id;
        const dId = state.views[viewId][destination.index].id;
        const sIndex = newTodos.findIndex((todo) => todo.id === sId);
        const dIndex = newTodos.findIndex((todo) => todo.id === dId);

        newTodos.splice(sIndex, 1);
        newTodos.splice(dIndex, 0, state.todos[sIndex]);

        return { ...state, todos: newTodos };
      }

      return state;
    }

    case SET_VIEW: {
      const { viewId, view } = action.meta;
      return { ...state, views: { ...state.views, [viewId]: view } };
    }

    default:
      return state;
  }
};

function* loadFromLocalStorage(localStorageId: string) {
  const todos = JSON.parse(
    localStorage.getItem(localStorageId) || "[]"
  ) as Todos;

  yield putResetTodos({ viewId: rootId, todos }, setTodosNoSave);
}

function* saveToLocalStorage(localStorageId: string) {
  const { todos }: TodosState = yield select(
    (state: { todos: TodosState }) => state.todos
  );

  localStorage.setItem(
    localStorageId,
    JSON.stringify(
      todos.map((todo) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.checked
      })) as Todos
    )
  );
}

function* enableSaveToLocalStorage(localStorageId: string) {
  yield takeLatest(
    [SET_TODOS, DELETE_TODO, TOGGLE_TODO, MOVE_TODO],
    saveToLocalStorage,
    localStorageId
  );
}

export function* enableLocalStorage(localStorageId: string) {
  yield loadFromLocalStorage(localStorageId);
  yield enableSaveToLocalStorage(localStorageId);
}

let currentId = Date.now();
export const tmpId = () => "todo" + currentId++;

const validateTitle = (title: string) => {
  const errors: string[] = [];

  if (title === "") {
    errors.push("Empty string");
  }

  return errors;
};

function* watchAddTodo(): SagaIterator {
  while (1) {
    const {
      meta: { viewId, title }
    }: AddTodoAction = yield take(ADD_TODO);
    const id = tmpId();
    const errors = validateTitle(title);

    const { todos }: TodosState = yield select(
      (state: { todos: TodosState }) => state.todos
    );

    yield put(
      setTodos({
        viewId,
        todos: todos.concat(
          errors.length
            ? {
                id,
                title,
                checked: false,
                validated: false,
                errors
              }
            : { id, title, checked: false, validated: true }
        )
      })
    );
  }
}

function* watchUpdateTodo(): SagaIterator {
  while (1) {
    const {
      meta: { viewId, id, title }
    }: UpdateTodoTitleAction = yield take(UPDATE_TODO_TITLE);
    const { todos }: TodosState = yield select(
      (state: { todos: TodosState }) => state.todos
    );

    const todo = todos.find((todo) => todo.id === id);

    if (!todo || title === todo.title) {
      continue;
    }

    yield put(
      setTodos({
        viewId,
        todos: todos.map((todo) => {
          if (todo.id !== id) {
            return todo;
          }

          const errors = validateTitle(title);

          return errors.length
            ? {
                id,
                title,
                checked: todo.checked,
                validated: false,
                errors
              }
            : {
                id,
                title,
                checked: todo.checked,
                validated: true
              };
        })
      })
    );
  }
}

function* putResetTodos(
  { viewId, todos }: { viewId: string; todos: Todos },
  resetTodos: (meta: { viewId: string; todos: TodoStates }) => TodoActionType
): SagaIterator {
  yield put(
    resetTodos({
      viewId,
      todos: todos.map((todo) => {
        const errors = validateTitle(todo.title);

        return errors.length
          ? {
              id: todo.id,
              title: todo.title,
              checked: todo.completed,
              validated: false,
              errors
            }
          : {
              id: todo.id,
              title: todo.title,
              checked: todo.completed,
              validated: true
            };
      })
    })
  );
}

function* watchResetTodos() {
  while (1) {
    const { meta }: ResetTodosAction = yield take(RESET_TODOS);

    yield putResetTodos(meta, setTodos);
  }
}

export function* watchInputs(): SagaIterator {
  yield fork(watchAddTodo);
  yield fork(watchUpdateTodo);
  yield fork(watchResetTodos);
}

function* updateView(): SagaIterator {
  const { todos }: TodosState = yield select(
    (state: { todos: TodosState }) => state.todos
  );
  const filter: VisibilityFilter = yield select(
    (state: { visibilityFilter: VisibilityFilter }) => state.visibilityFilter
  );
  let view: TodosView;

  switch (filter) {
    case VisibilityFilter.SHOW_ALL:
      view = todos;
      break;

    case VisibilityFilter.SHOW_ACTIVE:
      view = todos.filter((todo) => !todo.checked);
      break;

    case VisibilityFilter.SHOW_COMPLETED:
      view = todos.filter((todo) => todo.checked);
      break;

    case VisibilityFilter.SHOW_INVALID:
      view = todos.filter((todo) => !todo.validated);
      break;

    default:
      view = [];
  }

  yield put(setView({ viewId: rootId, view }));
}

export function* watchVisibilityFilter() {
  yield takeLatest(
    [
      SET_TODOS,
      SET_TODOS_NOSAVE,
      DELETE_TODO,
      TOGGLE_TODO,
      MOVE_TODO,
      SET_VISIBILITY_FILTER
    ],
    updateView
  );
}
