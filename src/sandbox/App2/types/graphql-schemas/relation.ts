import { SequelizeDefaultAttributes } from "./sequelize";
import { ItemId, RelationId } from "./ids";

export interface GQLRelation extends SequelizeDefaultAttributes {
  id: RelationId;
  type: string;
  itemId1: ItemId;
  itemId2: ItemId;
}
