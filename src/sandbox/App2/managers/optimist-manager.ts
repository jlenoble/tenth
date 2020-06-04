import { BEGIN, COMMIT, REVERT } from "redux-optimistic-ui";
import {
  Variables,
  Data,
  ApolloClientManagerInterface,
  FSA,
  Meta,
  MetaAction,
  OptimisticAction,
  Optimistic,
} from "../types";

type Mutations = "createItem" | "destroyItem" | "createRelatedItem";

type OptimisticInit<T extends Mutations> = {
  optimisticResponse?: Data[T];
  variables: Variables[T];
};

let _id = 0;
const tmpId = (): number => --_id;

const isOptimisticAction = <
  P,
  M extends Partial<Optimistic>,
  E extends Error = Error
>(
  action: FSA<P, M, E>
): action is OptimisticAction<P, M, E> => {
  const optimistic: Partial<Optimistic["optimistic"]> =
    action.meta?.optimistic || {};

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

  optimisticAction<
    P,
    M extends Partial<Meta & Optimistic>,
    E extends Error = Error
  >(action: FSA<P, M, E>): OptimisticAction<P, M, E> {
    const meta: Meta & Optimistic = { manager: this.clientManager };

    if (this.enabled) {
      // if (!isOptimisticAction(action)) {
      //   meta.optimistic = {
      //     type: BEGIN,
      //     id: action.payload?.optimisticId || tmpId(),
      //   };
      //   // create optimistic BEGIN (get optimistic id from user action or attribute new (cascade action))
      //   // for this id, map it ( or Set?)
      // }
    }

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
