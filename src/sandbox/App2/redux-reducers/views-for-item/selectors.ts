import { ensureState } from "redux-optimistic-ui";
import { ItemId, ViewId, State } from "../../types";

export const getViewsForItem = (id: ItemId) => (state: State): ViewId[] => {
  const viewIds = ensureState(state.viewsForItem).get(id);
  return viewIds ? [...viewIds] : [];
};
