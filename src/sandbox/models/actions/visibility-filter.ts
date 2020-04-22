import { VisibilityFilter } from "../types";
import { SET_VISIBILITY_FILTER } from "../constants";

export interface SetVisibilityFilterAction {
  type: typeof SET_VISIBILITY_FILTER;
  meta: { viewId: string; visibilityFilter: VisibilityFilter };
}
