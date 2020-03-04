import { List } from "../core";
import { makeListComponent } from "./ListFactory";
import tmpId from "./defaultTmpId";

export * from "./DisplayList";

export const SelectList = makeListComponent(List, {
  tmpId,
  listItemUI: { checkbox: true }
});

export * from "./InputList";
