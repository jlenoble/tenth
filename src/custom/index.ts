import { List } from "../core";
import { makeListComponent } from "./ListFactory";
import { defaultTmpId as tmpId } from "./InputList";

export const DisplayList = makeListComponent(List, { tmpId });

export const SelectList = makeListComponent(List, {
  tmpId,
  listItemUI: { selectable: true }
});

export const InputList = makeListComponent(List, {
  tmpId,
  ui: { addItem: true },
  listItemUI: { deletable: true }
});
