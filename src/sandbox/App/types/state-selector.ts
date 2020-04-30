import { ManagerState } from "./manager-reducer";
import { Payload } from "./item";
import { CombinedState } from "./combined-manager-reducer";
import { VisibilityFilter } from "./visibility-filter";

export type StateSelector = (state: CombinedState) => any;

export type StateSelectorMap<T> = {
  getState: (state: CombinedState) => ManagerState<T>;
  getItemMap: (state: CombinedState) => Map<string, Payload<T>>;
  getSelectionMap: (state: CombinedState) => Map<string, readonly string[]>;
  getVisibilityFilter: (state: CombinedState) => VisibilityFilter;
};
