import { rootId } from "../todo";
import { UIAction, UPDATE_SUBVIEW, UI } from "../ui";

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

export default ui;
