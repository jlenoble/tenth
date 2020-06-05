import { AnyAction } from "redux";
import {
  Variables,
  Data,
  ApolloClientManagerInterface,
  MetaAction,
} from "../types";

type Mutations = "createItem" | "destroyItem" | "createRelatedItem";

type OptimisticInit<T extends Mutations> = {
  optimisticResponse?: Data[T];
  variables: Variables[T];
};

let _id = 0;
const tmpId = (): number => --_id;

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
    const meta = { manager: this.clientManager };
    return { ...action, meta: { ...action.meta, ...meta } };
  }

  optimisticInit<T extends Mutations>(
    variables: Variables[T],
    optimisticResponse: Data[T]
  ): OptimisticInit<T> {
    if (this.enabled) {
      const optimisticId = tmpId();

      const init: OptimisticInit<T> = {
        variables: { ...variables, optimisticId },
        optimisticResponse: { ...optimisticResponse, optimisticId },
      };

      return init;
    }

    return { optimisticResponse, variables };
  }

  createItem(item: Variables["createItem"]): OptimisticInit<"createItem"> {
    return this.optimisticInit<"createItem">(item, {
      __typename: "Mutation",
      createItem: {
        __typename: "Item",
        id: tmpId(),
        ...item,
      },
    });
  }

  destroyItem(item: Variables["destroyItem"]): OptimisticInit<"destroyItem"> {
    return this.optimisticInit<"destroyItem">(item, {
      __typename: "Mutation",
      destroyItem: {
        __typename: "Item",
        ...item,
      },
    });
  }

  createRelatedItem(
    variables: Variables["createRelatedItem"]
  ): OptimisticInit<"createRelatedItem"> {
    const { relatedToId, relationId, ...item } = variables;
    const relatedId = tmpId();

    return this.optimisticInit<"createRelatedItem">(variables, {
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
    });
  }
}
