import { SagaIterator } from "redux-saga";
import { put, select, takeLatest } from "redux-saga/effects";
import { DropResult } from "react-beautiful-dnd";
import { VisibilityFilter } from "./types";

export type Todo = Readonly<{
  id: string;
  title: string;
  completed: boolean;
}>;
export type Todos = readonly Todo[];
export type TodoMap = Readonly<{ [id: string]: Omit<Todo, "id"> }>;

export type Part = readonly string[];
export type PartMap = Readonly<{ [id: string]: Part }>;

export type TodoState = Readonly<{
  id: string;
  title: string;
  checked: boolean;
  validated: boolean;
  errors?: readonly string[];
}>;
export type TodoStates = readonly TodoState[];
export type TodoStateMap = Readonly<{ [id: string]: TodoState }>;

export type PartState = TodoStates;
export type PartStateMap = Readonly<{ [partId: string]: PartState }>;

export type View = Readonly<{
  partId: string;
  visibilityFilter: VisibilityFilter;
  todos: TodoStates;
}>;
export type ViewMap = Readonly<{ [viewId: string]: View }>;

export type TodosState = Readonly<{
  todos: TodoStateMap;
  views: ViewMap;
  parts: PartStateMap;
}>;

export const RESET_TODOS = "RESET_TODOS";
const SET_TODOS = "SET_TODOS";
const SET_TODOS_NOSAVE = "SET_TODOS_NOSAVE";

export const ADD_TODO = "ADD_TODO";
export const DO_ADD_TODO = "DO_ADD_TODO";
export const UPDATE_TODO_TITLE = "UPDATE_TODO_TITLE";
export const DO_UPDATE_TODO_TITLE = "DO_UPDATE_TODO_TITLE";

export const DELETE_TODO = "DELETE_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const MOVE_TODO = "MOVE_TODO";

export const EXPAND_TODO = "EXPAND_TODO";

const ADD_PART = "ADD_PART";

const ADD_VIEW = "ADD_VIEW";
const UPDATE_VIEWS = "UPDATE_VIEWS";
const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";

export interface ResetTodosAction {
  type: typeof RESET_TODOS;
  meta: { partId: string; todos: Todos };
}
interface SetTodosAction {
  type: typeof SET_TODOS;
  meta: { partId: string; todos: TodoStates };
}
interface SetTodosNoSaveAction {
  type: typeof SET_TODOS_NOSAVE;
  meta: { partId: string; todos: TodoStates };
}

export interface AddTodoAction {
  type: typeof ADD_TODO;
  meta: { viewId: string; title: string };
}
interface DoAddTodoAction {
  type: typeof DO_ADD_TODO;
  meta: { viewId: string; todo: TodoState };
}

export interface UpdateTodoTitleAction {
  type: typeof UPDATE_TODO_TITLE;
  meta: { viewId: string; id: string; title: string };
}
interface DoUpdateTodoTitleAction {
  type: typeof DO_UPDATE_TODO_TITLE;
  meta: {
    viewId: string;
    todo: Pick<TodoState, "id" | "title" | "validated" | "errors">;
  };
}

interface DeleteTodoAction {
  type: typeof DELETE_TODO;
  meta: { viewId: string; id: string };
}
interface ToggleTodoAction {
  type: typeof TOGGLE_TODO;
  meta: { viewId: string; id: string };
}
interface MoveTodoAction {
  type: typeof MOVE_TODO;
  meta: { viewId: string; dropResult: DropResult };
}

export interface ExpandTodoAction {
  type: typeof EXPAND_TODO;
  meta: { id: string };
}

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

type TodoActionType =
  | ResetTodosAction
  | SetTodosAction
  | SetTodosNoSaveAction
  | AddTodoAction
  | DoAddTodoAction
  | UpdateTodoTitleAction
  | DoUpdateTodoTitleAction
  | DeleteTodoAction
  | ToggleTodoAction
  | MoveTodoAction
  | ExpandTodoAction
  | AddPartAction
  | AddViewAction
  | UpdateViewsAction
  | SetVisibilityFilterAction;

export const resetTodos = (meta: {
  partId: string;
  todos: Todos;
}): TodoActionType => {
  return {
    type: RESET_TODOS,
    meta
  };
};
export const setTodos = (meta: {
  partId: string;
  todos: TodoStates;
}): TodoActionType => {
  return {
    type: SET_TODOS,
    meta
  };
};
export const setTodosNoSave = (meta: {
  partId: string;
  todos: TodoStates;
}): TodoActionType => {
  return {
    type: SET_TODOS_NOSAVE,
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
export const doAddTodo = (meta: {
  viewId: string;
  todo: TodoState;
}): TodoActionType => {
  return {
    type: DO_ADD_TODO,
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
export const doUpdateTodoTitle = (meta: {
  viewId: string;
  todo: Pick<TodoState, "id" | "title" | "validated" | "errors">;
}): TodoActionType => {
  return {
    type: DO_UPDATE_TODO_TITLE,
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

export const expandTodo = (meta: { id: string }): TodoActionType => {
  return {
    type: EXPAND_TODO,
    meta
  };
};

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
const initialState: TodosState = {
  todos: {},
  views: {
    [rootId]: {
      partId: rootId,
      visibilityFilter: VisibilityFilter.SHOW_ALL,
      todos: []
    }
  },
  parts: { [rootId]: [] }
};

const makeView = (
  partId: string,
  visibilityFilter: VisibilityFilter,
  todos: TodoStates
) => {
  let view: View;

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

export const todos = (
  state = initialState,
  action: TodoActionType
): TodosState => {
  const { todos, views, parts } = state;

  switch (action.type) {
    case SET_TODOS:
    case SET_TODOS_NOSAVE: {
      const { partId, todos: newTodos } = action.meta;
      const todoMap = { ...todos };
      newTodos.forEach((todo) => {
        todoMap[todo.id] = todo;
      });

      return {
        todos: todoMap,
        views,
        parts: { ...parts, [partId]: newTodos }
      };
    }

    case DO_ADD_TODO: {
      const { viewId, todo } = action.meta;
      const partId = views[viewId].partId;

      return {
        todos: { ...todos, [todo.id]: todo },
        views,
        parts: { ...parts, [partId]: parts[partId].concat(todo) }
      };
    }

    case DO_UPDATE_TODO_TITLE: {
      const { viewId, todo } = action.meta;
      const partId = views[viewId].partId;
      const id = todo.id;
      const newTodo = { ...todos[id], ...todo };

      return {
        todos: { ...todos, [id]: newTodo },
        views,
        parts: {
          ...parts,
          [partId]: parts[partId].map((todo) =>
            todo.id === id ? newTodo : todo
          )
        }
      };
    }

    case DELETE_TODO: {
      const { viewId, id } = action.meta;
      const partId = views[viewId].partId;
      const newTodos = { ...todos };
      delete newTodos[id];

      return {
        todos: newTodos,
        views,
        parts: {
          ...parts,
          [partId]: parts[partId].filter((todo) => todo.id !== id)
        }
      };
    }

    case TOGGLE_TODO: {
      const { viewId, id } = action.meta;
      const partId = views[viewId].partId;
      const newTodo = { ...todos[id] };
      newTodo.checked = !newTodo.checked;

      return {
        todos: { ...todos, [id]: newTodo },
        views,
        parts: {
          ...parts,
          [partId]: parts[partId].map((todo) =>
            todo.id !== id ? todo : newTodo
          )
        }
      };
    }

    case MOVE_TODO: {
      const { viewId, dropResult } = action.meta;
      const { source, destination } = dropResult;
      const partId = views[viewId].partId;

      if (!destination) {
        return state;
      }

      if (destination.droppableId === source.droppableId) {
        if (destination.index === source.index) {
          return state;
        }

        const newTodos = parts[partId].concat();

        const sId = views[viewId].todos[source.index].id;
        const dId = views[viewId].todos[destination.index].id;
        const sIndex = newTodos.findIndex((todo) => todo.id === sId);
        const dIndex = newTodos.findIndex((todo) => todo.id === dId);

        newTodos.splice(sIndex, 1);
        newTodos.splice(dIndex, 0, parts[partId][sIndex]);

        return {
          todos,
          views,
          parts: { ...parts, [partId]: newTodos }
        };
      }

      return state;
    }

    case ADD_PART: {
      const { partId } = action.meta;
      return { ...state, parts: { ...parts, [partId]: [] } };
    }

    case ADD_VIEW: {
      const { viewId, partId } = action.meta;
      return {
        ...state,
        views: {
          ...views,
          [viewId]: {
            partId,
            visibilityFilter: VisibilityFilter.SHOW_ALL,
            todos: []
          }
        }
      };
    }

    case UPDATE_VIEWS: {
      const { partId } = action.meta;
      const relevantViews = Object.entries(views).filter(
        ([_, view]) => view.partId === partId
      );
      const todos = parts[partId];

      return {
        ...state,
        views: {
          ...views,
          ...Object.fromEntries(
            relevantViews.map(([viewId, { visibilityFilter }]) => {
              return [viewId, makeView(partId, visibilityFilter, todos)];
            })
          )
        }
      };
    }

    case SET_VISIBILITY_FILTER: {
      const { viewId, visibilityFilter } = action.meta;
      const partId = views[viewId].partId;
      const view = makeView(partId, visibilityFilter, parts[partId]);

      return { ...state, views: { ...views, [viewId]: view } };
    }

    default:
      return state;
  }
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
