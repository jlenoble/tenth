import { ADD_PART } from "../constants";

export interface AddPartAction {
  type: typeof ADD_PART;
  meta: { partId: string };
}
