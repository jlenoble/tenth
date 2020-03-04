import { List } from "../core";
import { makeListComponent } from "./ListFactory";
import tmpId from "./defaultTmpId";

export const DisplayList = makeListComponent(List, { tmpId });

export const SelectList = makeListComponent(List, {
  tmpId,
  listItemUI: { checkbox: true }
});

export * from "./InputList";
