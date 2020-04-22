import { ADD_PART } from "../constants";
import { TodoActionType } from "../todo";

export const addPart = (meta: { partId: string }): TodoActionType => {
  return {
    type: ADD_PART,
    meta
  };
};
