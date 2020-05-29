import { ensureState } from "redux-optimistic-ui";
import { ItemId, ViewId, State } from "../../types";

export const getViewsForSubItem = (id: ItemId) => (state: State): ViewId[] => {
  const viewIds = ensureState(state.viewsForSubItem).get(id);
  return viewIds ? [...viewIds] : [];
};
