import { SagaManager } from "./saga-manager";
import { ManagerConsts } from "./manager-consts";
import { ActionCreatorMap } from "../manager-action-creators";
import { ManagerReducer, ManagerState } from "./manager-reducer";
import { Payload } from "./item";
import { CombinedState } from "./combined-manager-reducer";
import { Validator } from "./validator";

export type Manager<T> = Readonly<{
  managerId: string;
  CONSTS: ManagerConsts;
  actionCreators: ActionCreatorMap<T>;
  reducer: ManagerReducer<T>;
  getState: (state: CombinedState) => ManagerState<T>;
  getItemMap: (state: CombinedState) => Map<string, Payload<T>>;
  getSelectionMap: (state: CombinedState) => Map<string, readonly string[]>;
  sagaManager: SagaManager;
  addMappedChild: <U>(
    childManagerId: string,
    adaptFromChildToParent: (payload: Payload<U>) => Payload<T>,
    adaptFromParentToChild: (payload: Payload<T>) => Payload<U>
  ) => Manager<U>;
  addFilteredChild: (childManagerId: string) => Manager<T>;
  getChildren: () => readonly Manager<any>[];
  addValidator: (validate: Validator<T>) => void;
}>;
