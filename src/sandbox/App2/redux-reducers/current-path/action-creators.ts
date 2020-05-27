import { SET_CURRENT_PATH } from "./consts";
import { SetCurrentPathAction } from "./actions";
import { ItemId } from "../../types";

export const setCurrentPath = (ids: ItemId[]): SetCurrentPathAction => ({
  type: SET_CURRENT_PATH,
  payload: ids,
});
