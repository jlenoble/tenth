import { List } from "../core";
import { makeListComponent } from "./ListFactory";
import { defaultTmpId as tmpId } from "./InputList";

export const DisplayList = makeListComponent(List, { tmpId });

export const SelectList = makeListComponent(List, {
  tmpId,
  listItemUI: { checkbox: true }
});

export const InputList = makeListComponent(List, {
  tmpId,
  ui: { addItem: true },
  listItemUI: { deleteButton: true }
});
