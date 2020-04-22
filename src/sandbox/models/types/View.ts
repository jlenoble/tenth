import { VisibilityFilter } from "./VisibilityFilter";

/*
{
  partId: string,     //  id of subset of all items
  visibilityFilter: VisibilityFilter,
  items: itemState[]; // subset of subset of all items
}
*/

export type View<
  ItemsKey extends string,
  ItemStates extends readonly Readonly<any>[]
> = Readonly<{
  partId: string;
  visibilityFilter: VisibilityFilter;
}> &
  Record<ItemsKey, ItemStates>;

export type ViewMap<
  ItemsKey extends string,
  ItemStates extends readonly Readonly<any>[]
> = Readonly<{
  [viewId: string]: View<ItemsKey, ItemStates>;
}>;
