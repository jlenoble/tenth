export enum VisibilityFilter {
  SHOW_ALL,
  SHOW_ACTIVE,
  SHOW_COMPLETED,
  SHOW_INVALID
}

export const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";

interface VisibilityFilterAction {
  type: typeof SET_VISIBILITY_FILTER;
  filter: VisibilityFilter;
}

export const setVisibilityFilter = (
  filter: VisibilityFilter
): VisibilityFilterAction => {
  return { type: SET_VISIBILITY_FILTER, filter };
};

const initialState: VisibilityFilter = VisibilityFilter.SHOW_ALL;

export const visibilityFilter = (
  state = initialState,
  action: VisibilityFilterAction
): VisibilityFilter => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;

    default:
      return state;
  }
};
