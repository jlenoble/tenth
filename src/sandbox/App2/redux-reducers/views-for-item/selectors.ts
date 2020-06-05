import { ItemId, ViewId, State } from "../../types";

export const getViewsForItem = (id: ItemId) => (state: State): ViewId[] => {
  const viewIds = state.viewsForItem.get(id);
  return viewIds ? [...viewIds] : [];
};
