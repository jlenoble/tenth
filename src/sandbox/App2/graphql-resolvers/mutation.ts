import { DataSources, MutationResolvers } from "../types";

export const mutationResolvers: Required<Omit<
  MutationResolvers<DataSources, Record<string, unknown>>,
  "_empty" | "destroyRelatedItem"
>> = {
  createItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.createItem(item),
  updateItem: (_, item, { dataSources: { itemAPI } }) =>
    itemAPI.updateItem(item),
  destroyItem: async (_, item, context, info) => {
    const {
      dataSources: { itemAPI, relationshipAPI },
    } = context;

    const items = await relationshipAPI.getAllRelatedItems({
      relatedToId: item.id,
      relationId: 2,
    });

    const gqlItem = await itemAPI.destroyItem(item);
    await relationshipAPI.destroyRelationshipsForItem(item, gqlItem.userId);

    const destroyItem = mutationResolvers.destroyItem;

    if (typeof destroyItem === "function") {
      for (const item of items.items) {
        await destroyItem(_, item, context, info);
      }
    }

    return gqlItem;
  },

  createRelatedItem: (_, item, { dataSources: { relationshipAPI } }) =>
    relationshipAPI.createRelatedItem(item),
};
