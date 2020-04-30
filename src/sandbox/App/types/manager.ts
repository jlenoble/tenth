import { SagaManager } from "./saga-manager";
import { ManagerConsts } from "./manager-consts";
import { ActionCreatorMap } from "./action-creator-map";
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
  addChild: <U>(
    childManagerId: string,
    options: {
      adaptToParent?: (payload: Payload<U>) => Payload<T>;
      adaptToChild?: (payload: Payload<T>) => Payload<U>;
      relationship: ManagerRelationship;
    }
  ) => Manager<U>;
  getChildren: () => readonly Manager<any>[];
  addValidator: (validate: Validator<T>) => void;
}>;

export type MutableManagerMap<T> = {
  [managerId: string]: Manager<T>;
};

export type ManagerMap<T> = Readonly<MutableManagerMap<T>>;

export enum ManagerRelationship {
  MAP,
  FILTER,
  SELECT
}
