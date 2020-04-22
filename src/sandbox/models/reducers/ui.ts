import { rootId } from "../todo";
import { UIAction, UPDATE_SUBVIEW, UI, CLOSE_SUBVIEW } from "../ui";

const initialState: UI = {
  mainViewId: rootId
};

export const ui = (state = initialState, action: UIAction) => {
  switch (action.type) {
    case UPDATE_SUBVIEW: {
      return { ...state, subViewId: action.meta.subViewId };
    }

    case CLOSE_SUBVIEW: {
      const newState = { ...state };
      delete newState.subViewId;
      return newState;
    }

    default:
      return state;
  }
};

export default ui;
