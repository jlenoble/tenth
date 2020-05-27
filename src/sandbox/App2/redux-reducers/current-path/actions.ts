import { SET_CURRENT_PATH } from "./consts";
import { ItemId } from "../../types";

export type SetCurrentPathAction = {
  type: typeof SET_CURRENT_PATH;
  payload: ItemId[];
};
