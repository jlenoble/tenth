import { VisibilityFilter } from "../types";
import { SET_VISIBILITY_FILTER } from "../constants";
import { TodoActionType } from "../todo";

export const setVisibilityFilter = (meta: {
  viewId: string;
  visibilityFilter: VisibilityFilter;
}): TodoActionType => {
  return {
    type: SET_VISIBILITY_FILTER,
    meta,
  };
};
