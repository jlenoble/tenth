import { ADD_VIEW, UPDATE_VIEWS } from "../constants";

export interface AddViewAction {
  type: typeof ADD_VIEW;
  meta: { viewId: string; partId: string };
}

export interface UpdateViewsAction {
  type: typeof UPDATE_VIEWS;
  meta: { partId: string };
}
