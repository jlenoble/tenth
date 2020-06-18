import { DataSources, QueryResolvers } from "../types";
import { DbDataManager } from "../managers";

export const queryResolvers: Required<Omit<
  QueryResolvers<DataSources, Record<string, unknown>>,
  "_empty"
>> = {
  me: (_, __, { dataSources: { userAPI } }) => userAPI.findOrCreateUser(),

  items: (_, __, { dataSources: { itemAPI } }) => itemAPI.getAllItems(),
  item: (_, item, { dataSources: { itemAPI } }) => itemAPI.getItemById(item),
  itemsById: (_, items, { dataSources: { itemAPI } }) =>
    itemAPI.getItemsById(items),

  coreItems: (_, __, { dataSources: { itemAPI } }) => itemAPI.getCoreItems(),
  coreItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.getCoreItemByTitle(item),

  itemWithRelatedItems: async (
    _,
    { relatedToId, relationId },
    { dataSources }
  ) => {
    const dataManager = new DbDataManager(dataSources);
    const {
      relation,
      item,
      relationships,
      items,
    } = await dataManager.getItemWithRelatedItems(relatedToId, relationId);
    return {
      relation,
      item,
      items,
      relationshipIds: relationships.map(({ id }) => id),
    };
  },

  itemWithOrderedItems: async (
    _,
    { relatedToId, relationId },
    { dataSources }
  ) => {
    const dataManager = new DbDataManager(dataSources);
    const {
      relation,
      item,
      relationships,
      items,
    } = await dataManager.getItemWithOrderedItems(relatedToId, relationId);
    return {
      relation,
      item,
      items,
      relationshipIds: relationships.map(({ id }) => id),
    };
  },

  relationshipsForItem: (_, item, { dataSources: { relationshipAPI } }) =>
    relationshipAPI.getRelationshipsForItem(item),
  relationshipsForItemAndRelation: (
    _,
    item,
    { dataSources: { relationshipAPI } }
  ) => relationshipAPI.getRelationshipsForItemAndRelation(item),
  relationshipsForLeftItemAndRelation: (
    _,
    item,
    { dataSources: { relationshipAPI } }
  ) => relationshipAPI.getRelationshipsForLeftItemAndRelation(item),
  relationshipsForRightItemAndRelation: (
    _,
    item,
    { dataSources: { relationshipAPI } }
  ) => relationshipAPI.getRelationshipsForRightItemAndRelation(item),
};
