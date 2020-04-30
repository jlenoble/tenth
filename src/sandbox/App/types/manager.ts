import { SagaManager } from "./saga-manager";
import { ManagerConsts } from "./manager-consts";
import { ActionCreatorMap } from "./action-creator-map";
import { ManagerReducer } from "./manager-reducer";
import { Payload } from "./item";
import { Validator } from "./validator";
import { StateSelectorMap } from "./state-selector";

export type Manager<T> = Readonly<{
  managerId: string;
  CONSTS: ManagerConsts;
  actionCreators: ActionCreatorMap<T>;
  stateSelectors: StateSelectorMap<T>;
  reducer: ManagerReducer<T>;
  sagaManager: SagaManager;
  addChild: <U>(
    childManagerId: string,
    options: {
      adaptToParent?: (payload: Payload<U>) => Payload<T>;
      adaptToChild?: (payload: Payload<T>) => Payload<U>;
      relationship: ManagerRelationship;
      selectionId?: string;
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
