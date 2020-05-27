import {
  DEEPEN_CURRENT_PATH,
  MOVE_BACK_CURRENT_PATH,
  SET_CURRENT_PATH,
} from "./consts";
import { ItemId } from "../../types";

export type DeepenCurrentPathAction = {
  type: typeof DEEPEN_CURRENT_PATH;
  payload: ItemId;
};

export type MoveBackCurrentPathAction = {
  type: typeof MOVE_BACK_CURRENT_PATH;
};

export type SetCurrentPathAction = {
  type: typeof SET_CURRENT_PATH;
  payload: ItemId[];
};

export type CurrentPathAction =
  | DeepenCurrentPathAction
  | MoveBackCurrentPathAction
  | SetCurrentPathAction;
