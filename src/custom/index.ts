import { List } from "../core";
import { makeListComponent } from "./ListFactory";
import { defaultTmpId as tmpId } from "./InputList";

export const DisplayList = makeListComponent(List, { tmpId });
