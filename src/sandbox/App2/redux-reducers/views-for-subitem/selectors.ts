import { ItemId, ViewId, State } from "../../types";

export const getViewsForSubItem = (id: ItemId) => (state: State): ViewId[] => {
  const viewIds = state.viewsForSubItem.get(id);
  return viewIds ? [...viewIds] : [];
};
