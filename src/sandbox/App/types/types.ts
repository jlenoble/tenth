import { SagaManager } from "./saga-manager";
import { ManagerConsts } from "./manager-consts";
import { ActionCreatorMap } from "../manager-action-creators";
import { ManagerReducer } from "../manager-reducer";
import { Errors } from "./errors";
import { Payload, PersistedItem } from "./item";

export type Id = string;
export type ItemId = Id;
export type ManagerId = Id;
export type SelectionId = Id;

export type Ids<Id> = readonly Id[];

export type MutablePayloadMap<T> = {
  [itemId: string]: Payload<T>;
};
export type PayloadMap<T> = Readonly<MutablePayloadMap<T>>;
export type PersistedItemMap<T> = Readonly<{
  [itemId: string]: PersistedItem<T>;
}>;

export type SelectionMap = Readonly<{
  [selectionId: string]: Ids<ItemId>;
}>;

export type Validator<T> = (payload: PersistedItem<T>) => Errors;

export type ManagerState<T> = {
  items: Map<ItemId, Payload<T>>;
  selections: Map<SelectionId, Ids<ItemId>>;
};

export type MutableCombinedState = { [managerId: string]: ManagerState<any> };
export type CombinedState = Readonly<MutableCombinedState>;

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
