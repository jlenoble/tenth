import { AnyAction } from "redux";
import { OptimisticAction } from "redux-optimistic-ui";
import {
  Variables,
  Data,
  ApolloClientManagerInterface,
  MetaAction,
} from "../types";

let _id = 0;
const tmpId = (): number => --_id;

const isOptimisticAction = <TAction extends AnyAction>(
  action: TAction
): action is MetaAction<TAction> & OptimisticAction => {
  const optimistic = action.meta?.optimistic || {};
  return (
    Object.getOwnPropertyNames(optimistic).length === 2 &&
    typeof optimistic.id === "number" &&
    typeof optimistic.type === "string"
  );
};

export class OptimistManager {
  public readonly clientManager: ApolloClientManagerInterface;

  private enabled: boolean;

  constructor({
    enabled = true,
    clientManager,
  }: {
    enabled: boolean;
    clientManager: ApolloClientManagerInterface;
  }) {
    this.enabled = enabled;
    this.clientManager = clientManager;
  }

  optimisticAction<TAction extends AnyAction>(
    action: TAction
  ): MetaAction<TAction> {
    if (isOptimisticAction(action)) {
      console.log(action.meta.optimistic);
      return action;
    }

    return action;
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
