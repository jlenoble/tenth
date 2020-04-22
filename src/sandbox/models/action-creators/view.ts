import { ADD_VIEW, UPDATE_VIEWS } from "../constants";
import { TodoActionType } from "../todo";

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
