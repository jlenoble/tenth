export enum VisibilityFilter {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE
}

export type VisibilityState = VisibilityFilter;

export const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";

export interface VisibilityFilterAction {
  type: typeof SET_VISIBILITY_FILTER;
  filter: VisibilityFilter;
}

export type VisibilityFilterActionType = VisibilityFilterAction;

export const setVisibilityFilter = (
  filter: VisibilityFilter
): VisibilityFilterActionType => {
  return { type: SET_VISIBILITY_FILTER, filter };
};

export const initialState: VisibilityState = VisibilityFilter.SHOW_ALL;

export const visibilityFilter = (
  state = initialState,
  action: VisibilityFilterActionType
): VisibilityState => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;

    default:
      return state;
  }
};
