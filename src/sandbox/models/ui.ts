export interface UI {
  mainViewId: string;
  subViewId?: string;
}

export const UPDATE_SUBVIEW = "UPDATE_SUBVIEW";
export const CLOSE_SUBVIEW = "CLOSE_SUBVIEW";

interface UpdateSubViewAction {
  type: typeof UPDATE_SUBVIEW;
  meta: { subViewId: string };
}

interface CloseSubViewAction {
  type: typeof CLOSE_SUBVIEW;
  meta: { subViewId: string };
}

export type UIAction = UpdateSubViewAction | CloseSubViewAction;

export const updateSubView = (meta: { subViewId: string }): UIAction => {
  return {
    type: UPDATE_SUBVIEW,
    meta,
  };
};

export const closeSubView = (meta: { subViewId: string }): UIAction => {
  return {
    type: CLOSE_SUBVIEW,
    meta,
  };
};
