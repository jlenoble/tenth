import { Item } from "./item";
import { Container } from "./container";

export interface Relationship extends Container {
  relation: Container | null | undefined;
  relationId: Item["id"] | -1;
}
