import { VisibilityFilter, TodoStates, View } from "./types";
import {
  TodoActions,
  AddPartAction,
  AddViewAction,
  UpdateViewsAction,
  SetVisibilityFilterAction
} from "./actions";

export type TodoActionType =
  | TodoActions
  | AddPartAction
  | AddViewAction
  | UpdateViewsAction
  | SetVisibilityFilterAction;

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
