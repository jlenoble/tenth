import { combineReducers } from "redux";
import todos from "./todos";
import ui from "./ui";

export const combinedReducer = combineReducers({
  todos,
  ui
});

export * from "./todos";
export * from "./ui";
