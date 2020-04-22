import { ViewMap } from "./View";

/*
{
  items: { id: itemState };       // all items
  parts: { [partId]: itemState[] }; // subset of all items
  views: {
    [viewId]: {
      partId: string,
      visibilityFilter: VisibilityFilter,
      items: itemState[];         // subset of subset of all items
    };
  };
}
*/

export type ItemsState<
  ItemsKey extends string,
  ItemState extends Readonly<{}>
> = Readonly<
  {
    views: ViewMap<ItemsKey, readonly ItemState[]>;
    parts: Readonly<{ [partId: string]: readonly ItemState[] }>;
  } & Record<ItemsKey, Readonly<{ [id: string]: ItemState }>>
>;
