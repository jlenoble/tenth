import { DropResult } from "react-beautiful-dnd";
import { Payload, PersistedItem, PayloadMap, PersistedItemMap } from "./item";
import { SelectionMap } from "./selections";
import { ManagerAction } from "./actions";

export type ActionCreatorMap<T> = {
  create: (payload: PersistedItem<T>) => ManagerAction<T>;
  destroy: (itemId: string) => ManagerAction<T>;
  modify: (itemId: string, payload: PersistedItem<T>) => ManagerAction<T>;
  set: (payload: {
    items: PersistedItemMap<T>;
    selections: SelectionMap;
  }) => ManagerAction<T>;
  clear: () => ManagerAction<T>;
  move: (itemId: string, payload: DropResult) => ManagerAction<T>;

  doCreate: (itemId: string, payload: Payload<T>) => ManagerAction<T>;
  doDestroy: (itemId: string) => ManagerAction<T>;
  doModify: (itemId: string, payload: Payload<T>) => ManagerAction<T>;
  doSet: (payload: {
    items: PayloadMap<T>;
    selections: SelectionMap;
  }) => ManagerAction<T>;
  doClear: () => ManagerAction<T>;
  doMove: (itemId: string, payload: DropResult) => ManagerAction<T>;

  ready: () => ManagerAction<T>;
};
