import { newViewId } from "./ids";

type View = Readonly<{ viewId: string }>;

type ViewMap = Readonly<{
  [viewId: string]: Omit<View, "viewId">;
}>;

const CLOSE = "CLOSE";
const CREATE = "CREATE";

type CloseAction = {
  type: typeof CLOSE;
  managerId: string;
  viewId: string;
};

type CreateAction = {
  type: typeof CREATE;
  managerId: string;
};

type Action = CloseAction | CreateAction;

export const close = ({
  managerId,
  viewId
}: {
  managerId: string;
  viewId: string;
}): Action => {
  return {
    type: CLOSE,
    managerId,
    viewId
  };
};

export const create = ({ managerId }: { managerId: string }): Action => {
  return {
    type: CREATE,
    managerId
  };
};

export const makeReducer = (managerId: string) => {
  const initialState: ViewMap = {};

  const views = (state = initialState, action: Action) => {
    if (action.managerId === managerId) {
      switch (action.type) {
        case CLOSE: {
          const newState = { ...state };
          delete newState[action.viewId];
          return newState;
        }

        case CREATE: {
          return { ...state, [newViewId()]: {} };
        }
      }
    }

    return state;
  };

  return views;
};
