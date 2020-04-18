import { put, select, takeLatest, takeEvery } from "redux-saga/effects";
import { DropResult } from "react-beautiful-dnd";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoState {
  id: string;
  title: string;
  checked: boolean;
}

export type Todos = Todo[];
export type TodosState = TodoState[];

export const ADD_TODO = "ADD_TODO";
export const DELETE_TODO = "DELETE_TODO";
export const UPDATE_TODO = "UPDATE_TODO";
export const UPDATE_TODO_TITLE = "UPDATE_TODO_TITLE";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const MOVE_TODO = "MOVE_TODO";
export const RESET_TODOS = "RESET_TODOS";
const RESET_TODOS_NOSAVE = "RESET_TODOS_NOSAVE";

export interface TodoAddAction {
  type: typeof ADD_TODO;
  meta: { title: string };
}

export interface TodoDeleteAction {
  type: typeof DELETE_TODO;
  meta: { id: string };
}

export interface TodoUpdateAction {
  type: typeof UPDATE_TODO;
  payload: TodoState;
}

export interface TodoUpdateTitleAction {
  type: typeof UPDATE_TODO_TITLE;
  meta: { id: string; title: string };
}

export interface TodoToggleAction {
  type: typeof TOGGLE_TODO;
  meta: { id: string };
}

export interface TodoMoveAction {
  type: typeof MOVE_TODO;
  meta: DropResult;
}

export interface TodosResetAction {
  type: typeof RESET_TODOS;
  payload: Todos;
}

interface TodosResetNoSaveAction {
  type: typeof RESET_TODOS_NOSAVE;
  payload: Todos;
}

export type TodoActionType =
  | TodoAddAction
  | TodoDeleteAction
  | TodoUpdateAction
  | TodoUpdateTitleAction
  | TodoToggleAction
  | TodoMoveAction
  | TodosResetAction
  | TodosResetNoSaveAction;

export const addTodo = (title: string): TodoActionType => {
  return {
    type: ADD_TODO,
    meta: { title }
  };
};

export const deleteTodo = (id: string): TodoActionType => {
  return {
    type: DELETE_TODO,
    meta: { id }
  };
};

export const updateTodo = (todo: TodoState): TodoActionType => {
  return {
    type: UPDATE_TODO,
    payload: todo
  };
};

export const updateTodoTitle = (id: string, title: string): TodoActionType => {
  return {
    type: UPDATE_TODO_TITLE,
    meta: { id, title }
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

export const resetTodos = (todos: Todos): TodoActionType => {
  return {
    type: RESET_TODOS,
    payload: todos
  };
};

const resetTodosNoSave = (todos: Todos): TodoActionType => {
  return {
    type: RESET_TODOS_NOSAVE,
    payload: todos
  };
};

export const initialState: TodosState = [];

let currentId = Date.now();
export const tmpId = () => "todo" + currentId++;

export const todos = (
  state = initialState,
  action: TodoActionType
): TodosState => {
  switch (action.type) {
    case ADD_TODO:
      return state.concat({
        id: tmpId(),
        title: action.meta.title,
        checked: false
      });

    case DELETE_TODO:
      return state.filter((todo) => todo.id !== action.meta.id);

    case UPDATE_TODO:
      return state.map((todo) =>
        todo.id !== action.payload.id ? todo : action.payload
      );

    case UPDATE_TODO_TITLE:
      return state.map((todo) =>
        todo.id !== action.meta.id
          ? todo
          : { ...todo, title: action.meta.title }
      );

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

    case RESET_TODOS:
    case RESET_TODOS_NOSAVE:
      return action.payload.map((todo) => ({
        id: todo.id,
        title: todo.title,
        checked: todo.completed
      }));

    default:
      return state;
  }
};

export function* loadFromLocalStorage(localStorageId: string) {
  const todos = JSON.parse(
    localStorage.getItem(localStorageId) || "[]"
  ) as Todos;

  yield put(resetTodosNoSave(todos));
}

export function* saveToLocalStorage(localStorageId: string) {
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

export function* enableSaveToLocalStorage(localStorageId: string) {
  yield takeLatest(
    [
      ADD_TODO,
      DELETE_TODO,
      UPDATE_TODO,
      UPDATE_TODO_TITLE,
      TOGGLE_TODO,
      MOVE_TODO,
      RESET_TODOS
    ],
    saveToLocalStorage,
    localStorageId
  );
}

export function* enableLocalStorage(localStorageId: string) {
  yield loadFromLocalStorage(localStorageId);
  yield enableSaveToLocalStorage(localStorageId);
}

export function* validateInput() {
  function* validate(...args: any[]) {
    console.log(...args);
  }

  yield takeEvery(ADD_TODO, validate);
}
