import { rootId } from "./todo";

export interface UI {
  mainViewId: string;
  subViewId?: string;
}

const UPDATE_SUBVIEW = "UPDATE_SUBVIEW";

interface UpdateSubViewAction {
  type: typeof UPDATE_SUBVIEW;
  meta: { subViewId: string };
}

type UIAction = UpdateSubViewAction;

export const updateSubView = (meta: { subViewId: string }): UIAction => {
  return {
    type: UPDATE_SUBVIEW,
    meta
  };
};

const initialState: UI = {
  mainViewId: rootId
};

export const ui = (state = initialState, action: UIAction) => {
  switch (action.type) {
    case UPDATE_SUBVIEW: {
      return { ...state, subViewId: action.meta.subViewId };
    }

    default:
      return state;
  }
};
