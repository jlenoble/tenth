import { Variables, Data } from "../types";

let _id = 0;
const tmpId = (): number => --_id;

export class OptimistManager {
  private enabled: boolean;

  constructor(enabled = true) {
    this.enabled = enabled;
  }

  createItem(item: Variables["createItem"]): Data["createItem"] | undefined {
    if (this.enabled) {
      return {
        __typename: "Mutation",
        createItem: {
          __typename: "Item",
          id: tmpId(),
          ...item,
        },
      };
    }
  }

  destroyItem(item: Variables["destroyItem"]): Data["destroyItem"] | undefined {
    if (this.enabled) {
      return {
        __typename: "Mutation",
        destroyItem: {
          __typename: "Item",
          ...item,
        },
      };
    }
  }

  createRelatedItem({
    relatedToId,
    relationId,
    ...item
  }: Variables["createRelatedItem"]): Data["createRelatedItem"] | undefined {
    if (this.enabled) {
      const relatedId = tmpId();

      return {
        __typename: "Mutation",
        createRelatedItem: {
          __typename: "RelatedItem",
          item: {
            __typename: "Item",
            id: relatedId,
            ...item,
          },
          relationship: {
            __typename: "Relationship",
            id: tmpId(),
            ids: [relatedToId, relationId, relatedId],
          },
        },
      };
    }
  }
}
