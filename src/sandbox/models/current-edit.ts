export interface CurrentEdit {
  elementId: string;
  value: string;
}

export type CurrentEditState = CurrentEdit;

export const CURRENT_EDIT_START = "CURRENT_EDIT_START";
export const CURRENT_EDIT_UPDATE = "CURRENT_EDIT_UPDATE";
export const CURRENT_EDIT_STOP = "CURRENT_EDIT_STOP";

export interface CurrentEditStartAction {
  type: typeof CURRENT_EDIT_START;
  payload: CurrentEdit;
}

export interface CurrentEditUpdateAction {
  type: typeof CURRENT_EDIT_UPDATE;
  payload: CurrentEdit;
}

export interface CurrentEditStopAction {
  type: typeof CURRENT_EDIT_STOP;
}

export type CurrentEditActionType =
  | CurrentEditStartAction
  | CurrentEditUpdateAction
  | CurrentEditStopAction;

export const startCurrentEdit = (state: CurrentEdit): CurrentEditActionType => {
  return { type: CURRENT_EDIT_START, payload: state };
};

export const updateCurrentEdit = (
  state: CurrentEdit
): CurrentEditActionType => {
  return { type: CURRENT_EDIT_UPDATE, payload: state };
};

export const stopCurrentEdit = (): CurrentEditActionType => {
  return { type: CURRENT_EDIT_STOP };
};

export const initialState: CurrentEditState = { elementId: "", value: "" };

export const currentEdit = (
  state = initialState,
  action: CurrentEditActionType
): CurrentEditState => {
  switch (action.type) {
    case CURRENT_EDIT_START:
    case CURRENT_EDIT_UPDATE:
      return action.payload;

    case CURRENT_EDIT_STOP:
      return initialState;

    default:
      return state;
  }
};
