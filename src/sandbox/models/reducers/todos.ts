import { VisibilityFilter } from "../types";
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
} from "../constants";
import { TodosState } from "../types";
import { TodoActionType, rootId, makeView } from "../todo";

export const todosInitialState: TodosState = {
  todos: {},
  views: {
    [rootId]: {
      partId: rootId,
      visibilityFilter: VisibilityFilter.SHOW_ACTIVE,
      todos: []
    }
  },
  parts: { [rootId]: [] }
};

export const todos = (
  state = todosInitialState,
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
      const { viewId, partId, visibilityFilter } = action.meta;
      return {
        ...state,
        views: {
          ...views,
          [viewId]: {
            partId,
            visibilityFilter,
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

export default todos;
