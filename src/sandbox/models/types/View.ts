import { VisibilityFilter } from "./VisibilityFilter";

export type View<
  StatePropName extends string,
  States extends readonly any[]
> = Readonly<{
  partId: string;
  visibilityFilter: VisibilityFilter;
}> &
  Record<StatePropName, States>;

export type ViewMap<
  StatePropName extends string,
  States extends readonly any[]
> = Readonly<{
  [viewId: string]: View<StatePropName, States>;
}>;
