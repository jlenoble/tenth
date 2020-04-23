import { VisibilityFilter } from "../types";
import { ADD_VIEW, UPDATE_VIEWS } from "../constants";

export interface AddViewAction {
  type: typeof ADD_VIEW;
  meta: { viewId: string; partId: string; visibilityFilter: VisibilityFilter };
}

export interface UpdateViewsAction {
  type: typeof UPDATE_VIEWS;
  meta: { partId: string };
}
