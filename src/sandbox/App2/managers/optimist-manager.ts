import { AnyAction } from "redux";
import { OptimisticAction } from "redux-optimistic-ui";
import {
  Variables,
  Data,
  ApolloClientManagerInterface,
  MetaAction,
} from "../types";

type OptimisticInit<
  T extends "createItem" | "destroyItem" | "createRelatedItem"
> = {
  optimisticResponse?: Data[T];
  variables: Variables[T];
};

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
    if (this.enabled) {
      if (!isOptimisticAction(action)) {
        const meta = { ...action.meta };
      }
    }

    return action;
  }

  createItem(item: Variables["createItem"]): OptimisticInit<"createItem"> {
    const init: OptimisticInit<"createItem"> = { variables: { ...item } };

    if (this.enabled) {
      init.optimisticResponse = {
        __typename: "Mutation",
        optimisticId: tmpId(),
        createItem: {
          __typename: "Item",
          id: tmpId(),
          ...item,
        },
      };
    }

    return init;
  }

  destroyItem(item: Variables["destroyItem"]): OptimisticInit<"destroyItem"> {
    const init: OptimisticInit<"destroyItem"> = { variables: { ...item } };

    if (this.enabled) {
      init.optimisticResponse = {
        __typename: "Mutation",
        optimisticId: tmpId(),
        destroyItem: {
          __typename: "Item",
          ...item,
        },
      };
    }

    return init;
  }

  createRelatedItem({
    relatedToId,
    relationId,
    ...item
  }: Variables["createRelatedItem"]): OptimisticInit<"createRelatedItem"> {
    const init: OptimisticInit<"createRelatedItem"> = {
      variables: {
        relatedToId,
        relationId,
        ...item,
      },
    };

    if (this.enabled) {
      const relatedId = tmpId();

      init.optimisticResponse = {
        __typename: "Mutation",
        optimisticId: tmpId(),
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

    return init;
  }
}
