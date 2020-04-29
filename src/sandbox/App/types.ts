export type Id = string;
export type ItemId = Id;
export type ManagerId = Id;
export type SelectionId = Id;

export type Ids<Id> = readonly Id[];

export type Errors = readonly string[];

export type PersistedItem<T> = Readonly<Omit<T, "itemId" | "errors">>;
export type Payload<T> = Readonly<PersistedItem<T> & { errors?: Errors }>;
export type Item<T> = Readonly<
  PersistedItem<T> & { itemId: ItemId; errors?: Errors }
>;

export type MutablePayloadMap<T> = {
  [itemId: string]: Payload<T>;
};
export type PayloadMap<T> = Readonly<MutablePayloadMap<T>>;
export type PersistedItemMap<T> = Readonly<{
  [itemId: string]: PersistedItem<T>;
}>;

export type SelectionMap = Readonly<{
  [selectionId: string]: Ids<SelectionId>;
}>;

export type Validator<T> = (payload: PersistedItem<T>) => Errors;

export type ManagerState<T> = Map<ItemId, Payload<T>>;

export type MutableCombinedState = { [managerId: string]: ManagerState<any> };
export type CombinedState = Readonly<MutableCombinedState>;
