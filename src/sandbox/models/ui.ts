export interface UI {
  mainViewId: string;
  subViewId?: string;
}

export const UPDATE_SUBVIEW = "UPDATE_SUBVIEW";

interface UpdateSubViewAction {
  type: typeof UPDATE_SUBVIEW;
  meta: { subViewId: string };
}

export type UIAction = UpdateSubViewAction;

export const updateSubView = (meta: { subViewId: string }): UIAction => {
  return {
    type: UPDATE_SUBVIEW,
    meta
  };
};
