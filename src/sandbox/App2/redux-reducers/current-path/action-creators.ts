import {
  DEEPEN_CURRENT_PATH,
  MOVE_BACK_CURRENT_PATH,
  SET_CURRENT_PATH,
  SET_CURRENT_PATH_TO_SIBLING_PATH,
} from "./consts";
import {
  DeepenCurrentPathAction,
  MoveBackCurrentPathAction,
  SetCurrentPathAction,
  SetCurrentPathToSiblingPathAction,
} from "./actions";
import { ItemId } from "../../types";

export const deepenCurrentPath = (id: ItemId): DeepenCurrentPathAction => ({
  type: DEEPEN_CURRENT_PATH,
  payload: id,
});

export const moveBackCurrentPath = (): MoveBackCurrentPathAction => ({
  type: MOVE_BACK_CURRENT_PATH,
});

export const setCurrentPath = (ids: ItemId[]): SetCurrentPathAction => ({
  type: SET_CURRENT_PATH,
  payload: ids,
});

export const setCurrentPathToSiblingPath = (
  id: ItemId
): SetCurrentPathToSiblingPathAction => ({
  type: SET_CURRENT_PATH_TO_SIBLING_PATH,
  payload: id,
});
