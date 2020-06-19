import { Data, ApolloClientManagerInterface } from "../types";

export class CompletedManager {
  public readonly clientManager: ApolloClientManagerInterface;

  constructor({
    clientManager,
  }: {
    clientManager: ApolloClientManagerInterface;
  }) {
    this.clientManager = clientManager;
  }

  getItemWithRelatedItems() {
    return (data: Data["itemWithRelatedItems"]): void => {
      const itemWithRelatedItems = data.itemWithRelatedItems;

      if (itemWithRelatedItems !== undefined) {
        const { relation, item, items, relationshipIds } = itemWithRelatedItems;
        const { id: relatedToId } = item;
        const { id: relationId } = relation;

        const relationships = relationshipIds.map((id, i) => {
          return { id, ids: [relatedToId, relationId, items[i].id] };
        });

        this.clientManager.addToStore({
          item,
          relation,
          items,
          relationships,
          viewId: this.clientManager.dataIdFromObject(itemWithRelatedItems),
        });
      }
    };
  }

  getItemWithOrderedItems() {
    return (data: Data["itemWithOrderedItems"]): void => {
      const itemWithOrderedItems = data.itemWithOrderedItems;

      if (itemWithOrderedItems !== undefined) {
        const { relation, item, items, relationships } = itemWithOrderedItems;
        console.log(itemWithOrderedItems);

        this.clientManager.addToStore({
          item,
          relation,
          items,
          relationships,
          viewId: this.clientManager.dataIdFromObject(itemWithOrderedItems),
        });
      }
    };
  }

  getItemsById() {
    return (data: Data["itemsById"]): void => {
      this.clientManager.addToStore({
        items: data.itemsById,
      });
    };
  }

  getRelation() {
    return (data: Data["coreItem"]): void => {
      if (data.coreItem) {
        this.clientManager.addToStore({
          items: [data.coreItem],
        });
      }
    };
  }
}
