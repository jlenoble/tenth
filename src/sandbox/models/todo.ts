import { SagaIterator } from "redux-saga";
import { fork, put, take, select, takeLatest } from "redux-saga/effects";
import { DropResult } from "react-beautiful-dnd";

export type Todo = Readonly<{
  id: string;
  title: string;
  completed: boolean;
}>;

export type TodoState = Readonly<{
  id: string;
  title: string;
  checked: boolean;
  validated: boolean;
  errors?: readonly string[];
}>;

export type Todos = readonly Todo[];
export type TodosState = readonly TodoState[];

const SET_TODOS = "SET_TODOS";
const SET_TODOS_NOSAVE = "SET_TODOS_NOSAVE";
const ADD_TODO_REQUEST = "ADD_TODO_REQUEST";
const ADD_TODO_RESPONSE = "ADD_TODO_RESPONSE";
const UPDATE_TODO_TITLE_REQUEST = "UPDATE_TODO_TITLE_REQUEST";
const UPDATE_TODO_TITLE_RESPONSE = "UPDATE_TODO_TITLE_RESPONSE";
const RESET_TODOS_REQUEST = "RESET_TODOS_REQUEST";
const RESET_TODOS_RESPONSE = "RESET_TODOS_RESPONSE";
const RESET_TODOS_RESPONSE_NOSAVE = "RESET_TODOS_RESPONSE_NOSAVE";
export const DELETE_TODO = "DELETE_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const MOVE_TODO = "MOVE_TODO";

interface SetTodosAction {
  type: typeof SET_TODOS;
  payload: TodosState;
}
interface SetTodosNoSaveAction {
  type: typeof SET_TODOS_NOSAVE;
  payload: TodosState;
}

interface AddTodoRequestAction {
  type: typeof ADD_TODO_REQUEST;
  meta: { title: string };
}
interface AddTodoResponseAction {
  type: typeof ADD_TODO_RESPONSE;
  payload: TodoState;
}

interface UpdateTodoTitleRequestAction {
  type: typeof UPDATE_TODO_TITLE_REQUEST;
  meta: { id: string; title: string };
}
interface UpdateTodoTitleResponseAction {
  type: typeof UPDATE_TODO_TITLE_RESPONSE;
  payload: TodoState;
}

interface ResetTodosRequestAction {
  type: typeof RESET_TODOS_REQUEST;
  payload: Todos;
}
interface ResetTodosResponseAction {
  type: typeof RESET_TODOS_RESPONSE;
  payload: TodosState;
}
interface ResetTodosResponseNoSaveAction {
  type: typeof RESET_TODOS_RESPONSE_NOSAVE;
  payload: TodosState;
}

export interface TodoDeleteAction {
  type: typeof DELETE_TODO;
  meta: { id: string };
}

export interface TodoToggleAction {
  type: typeof TOGGLE_TODO;
  meta: { id: string };
}

export interface TodoMoveAction {
  type: typeof MOVE_TODO;
  meta: DropResult;
}

type TodoActionType =
  | SetTodosAction
  | SetTodosNoSaveAction
  | AddTodoRequestAction
  | AddTodoResponseAction
  | UpdateTodoTitleRequestAction
  | UpdateTodoTitleResponseAction
  | ResetTodosRequestAction
  | ResetTodosResponseAction
  | ResetTodosResponseNoSaveAction
  | TodoDeleteAction
  | TodoToggleAction
  | TodoMoveAction;

const setTodos = (todos: TodosState): TodoActionType => {
  return {
    type: SET_TODOS,
    payload: todos
  };
};
const setTodosNoSave = (todos: TodosState): TodoActionType => {
  return {
    type: SET_TODOS_NOSAVE,
    payload: todos
  };
};

export const addTodo = (title: string): TodoActionType => {
  return {
    type: ADD_TODO_REQUEST,
    meta: { title }
  };
};
const addTodoResponse = (todo: TodoState): TodoActionType => {
  return {
    type: ADD_TODO_RESPONSE,
    payload: todo
  };
};

export const updateTodoTitle = (id: string, title: string): TodoActionType => {
  return {
    type: UPDATE_TODO_TITLE_REQUEST,
    meta: { id, title }
  };
};
const updateTodoTitleResponse = (todo: TodoState): TodoActionType => {
  return {
    type: UPDATE_TODO_TITLE_RESPONSE,
    payload: todo
  };
};

export const resetTodos = (todos: Todos): TodoActionType => {
  return {
    type: RESET_TODOS_REQUEST,
    payload: todos
  };
};
const resetTodosResponse = (todos: TodosState): TodoActionType => {
  return {
    type: RESET_TODOS_RESPONSE,
    payload: todos
  };
};
const resetTodosResponseNoSave = (todos: TodosState): TodoActionType => {
  return {
    type: RESET_TODOS_RESPONSE_NOSAVE,
    payload: todos
  };
};

export const deleteTodo = (id: string): TodoActionType => {
  return {
    type: DELETE_TODO,
    meta: { id }
  };
};

export const toggleTodo = (id: string): TodoActionType => {
  return {
    type: TOGGLE_TODO,
    meta: { id }
  };
};

export const moveTodo = (dropResult: DropResult): TodoActionType => {
  return {
    type: MOVE_TODO,
    meta: dropResult
  };
};

const initialState: TodosState = [];

export const todos = (
  state = initialState,
  action: TodoActionType
): TodosState => {
  switch (action.type) {
    case ADD_TODO_RESPONSE:
      return state.concat(action.payload);

    case UPDATE_TODO_TITLE_RESPONSE:
      return state.map((todo) =>
        todo.id !== action.payload.id ? todo : action.payload
      );

    case SET_TODOS:
    case SET_TODOS_NOSAVE:
    case RESET_TODOS_RESPONSE:
    case RESET_TODOS_RESPONSE_NOSAVE:
      return action.payload;

    case DELETE_TODO:
      return state.filter((todo) => todo.id !== action.meta.id);

    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.meta.id ? todo : { ...todo, checked: !todo.checked }
      );

    case MOVE_TODO: {
      const { source, destination } = action.meta;

      if (!destination) {
        return state;
      }

      if (destination.droppableId === source.droppableId) {
        if (destination.index === source.index) {
          return state;
        }

        const newTodos = state.concat();
        newTodos.splice(source.index, 1);
        newTodos.splice(destination.index, 0, state[source.index]);

        return newTodos;
      }

      return state;
    }

    default:
      return state;
  }
};

function* loadFromLocalStorage(localStorageId: string) {
  const todos = JSON.parse(
    localStorage.getItem(localStorageId) || "[]"
  ) as Todos;

  yield putResetTodos(todos, resetTodosResponseNoSave);
}

function* saveToLocalStorage(localStorageId: string) {
  const todos: TodosState = yield select(
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
    [
      SET_TODOS,
      ADD_TODO_RESPONSE,
      UPDATE_TODO_TITLE_RESPONSE,
      RESET_TODOS_RESPONSE,
      DELETE_TODO,
      TOGGLE_TODO,
      MOVE_TODO
    ],
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
      meta: { title }
    }: AddTodoRequestAction = yield take(ADD_TODO_REQUEST);
    const id = tmpId();
    const errors = validateTitle(title);

    yield put(
      addTodoResponse(
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
    );
  }
}

function* watchUpdateTodo(): SagaIterator {
  while (1) {
    const {
      meta: { id, title }
    }: UpdateTodoTitleRequestAction = yield take(UPDATE_TODO_TITLE_REQUEST);
    const todos: TodosState = yield select(
      (state: { todos: TodosState }) => state.todos
    );
    const todo = todos.find((todo) => todo.id === id);

    if (!todo || title === todo.title) {
      continue;
    }

    const errors = validateTitle(title);

    yield put(
      updateTodoTitleResponse(
        errors.length
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
            }
      )
    );
  }
}

function* putResetTodos(
  todos: Todos,
  resetTodosResponse: (todos: TodosState) => TodoActionType
): SagaIterator {
  yield put(
    resetTodosResponse(
      todos.map((todo) => {
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
    )
  );
}

function* watchResetTodos() {
  while (1) {
    const { payload }: ResetTodosRequestAction = yield take(
      RESET_TODOS_REQUEST
    );

    yield putResetTodos(payload, resetTodosResponse);
  }
}

export function* watchInputs(): SagaIterator {
  yield fork(watchAddTodo);
  yield fork(watchUpdateTodo);
  yield fork(watchResetTodos);
}
