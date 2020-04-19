enum VisibilityFilter {
  SHOW_ALL,
  SHOW_REMAINING,
  SHOW_COMPLETED,
  SHOW_INVALID
}

type VisibilityState = VisibilityFilter;

const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";

interface VisibilityFilterAction {
  type: typeof SET_VISIBILITY_FILTER;
  filter: VisibilityFilter;
}

type VisibilityFilterActionType = VisibilityFilterAction;

export const setVisibilityFilter = (
  filter: VisibilityFilter
): VisibilityFilterActionType => {
  return { type: SET_VISIBILITY_FILTER, filter };
};

const initialState: VisibilityState = VisibilityFilter.SHOW_ALL;

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
