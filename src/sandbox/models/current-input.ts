export interface CurrentInput {
  elementId: string;
  value: string;
}

export type CurrentInputState = CurrentInput;

export const CURRENT_INPUT_START = "CURRENT_INPUT_START";
export const CURRENT_INPUT_UPDATE = "CURRENT_INPUT_UPDATE";
export const CURRENT_INPUT_STOP = "CURRENT_INPUT_STOP";

export interface CurrentInputStartAction {
  type: typeof CURRENT_INPUT_START;
  payload: CurrentInput;
}

export interface CurrentInputUpdateAction {
  type: typeof CURRENT_INPUT_UPDATE;
  payload: CurrentInput;
}

export interface CurrentInputStopAction {
  type: typeof CURRENT_INPUT_STOP;
}

export type CurrentInputActionType =
  | CurrentInputStartAction
  | CurrentInputUpdateAction
  | CurrentInputStopAction;

export const startCurrentInput = (
  state: CurrentInput | string
): CurrentInputActionType => {
  return {
    type: CURRENT_INPUT_START,
    payload: typeof state === "string" ? { elementId: "", value: state } : state
  };
};

export const updateCurrentInput = (
  state: CurrentInput | string
): CurrentInputActionType => {
  return {
    type: CURRENT_INPUT_UPDATE,
    payload: typeof state === "string" ? { elementId: "", value: state } : state
  };
};

export const stopCurrentInput = (): CurrentInputActionType => {
  return { type: CURRENT_INPUT_STOP };
};

export const initialState: CurrentInputState = { elementId: "", value: "" };

export const currentInput = (
  state = initialState,
  action: CurrentInputActionType
): CurrentInputState => {
  switch (action.type) {
    case CURRENT_INPUT_START:
    case CURRENT_INPUT_UPDATE:
      return action.payload;

    case CURRENT_INPUT_STOP:
      return initialState;

    default:
      return state;
  }
};
