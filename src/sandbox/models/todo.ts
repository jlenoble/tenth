export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type TodoState = Todo[];

export const ADD_TODO = "ADD_TODO";
export const DELETE_TODO = "DELETE_TODO";
export const UPDATE_TODO = "UPDATE_TODO";
export const TOGGLE_TODO = "TOGGLE_TODO";

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
  payload: Todo;
}

export interface TodoToggleAction {
  type: typeof TOGGLE_TODO;
  meta: { id: string };
}

export type TodoActionType =
  | TodoAddAction
  | TodoDeleteAction
  | TodoUpdateAction
  | TodoToggleAction;

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

export const updateTodo = (todo: Todo): TodoActionType => {
  return {
    type: UPDATE_TODO,
    payload: todo
  };
};

export const toggleTodo = (id: string): TodoActionType => {
  return {
    type: TOGGLE_TODO,
    meta: { id }
  };
};

export const localStorageId = "todos";

export const initialState: TodoState = [];

let currentId = Date.now();
export const tmpId = () => "todo" + currentId++;

export const todos = (
  state = initialState,
  action: TodoActionType
): TodoState => {
  switch (action.type) {
    case ADD_TODO:
      return state.concat({
        id: tmpId(),
        title: action.meta.title,
        completed: false
      });

    case DELETE_TODO:
      return state.filter((todo) => todo.id !== action.meta.id);

    case UPDATE_TODO:
      return state.map((todo) =>
        todo.id !== action.payload.id ? todo : { ...todo, ...action.payload }
      );

    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.meta.id
          ? todo
          : { ...todo, completed: !todo.completed }
      );

    default:
      return state;
  }
};
