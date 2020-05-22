import { ApolloError } from "apollo-client";
import { QueryResult } from "@apollo/react-common";
import {
  useQuery,
  useMutation,
  QueryHookOptions,
  MutationHookOptions,
  MutationTuple,
} from "@apollo/react-hooks";

import { nodes } from "../client/graphql-nodes";
import {
  ItemId,
  Data,
  Variables,
  ApolloClientManagerInterface,
} from "../types";

type UseItems<Key extends keyof Data> = {
  data?: Data[Key];
  loading: boolean;
  error?: ApolloError;
  add: (input: string) => Promise<void>;
  makeDestroy: (id: ItemId) => () => Promise<void>;
};

export class ApolloHooksManager {
  public readonly clientManager: ApolloClientManagerInterface;

  constructor(clientManager: ApolloClientManagerInterface) {
    this.clientManager = clientManager;
  }

  useQuery<Key extends keyof Data>(
    key: Key,
    options?: QueryHookOptions<Data[Key], Variables[Key]>
  ): QueryResult<Data[Key], Variables[Key]> {
    return useQuery<Data[Key], Variables[Key]>(nodes[key], options);
  }

  useMutation<Key extends keyof Data>(
    key: Key,
    options?: MutationHookOptions<Data[Key], Variables[Key]>
  ): MutationTuple<Data[Key], Variables[Key]> {
    return useMutation<Data[Key], Variables[Key]>(nodes[key], options);
  }

  useAddItem(): (input?: string) => Promise<void> {
    const [addItem] = this.useMutation<"createItem">("createItem", {
      update: this.clientManager.updateOnCreateItem(),
    });

    const add = async (input = ""): Promise<void> => {
      const variables = { title: input };
      await addItem({
        variables,
        optimisticResponse: this.clientManager.optimisticCreateItem(variables),
      });
    };

    return add;
  }

  useAddRelatedItem(
    relatedToId: ItemId,
    relationId: ItemId
  ): (input?: string) => Promise<void> {
    const [addItem] = useMutation<
      Data["createRelatedItem"],
      Variables["createRelatedItem"]
    >(nodes["createRelatedItem"], {
      update: this.clientManager.updateOnCreateRelatedItem(),
    });

    const add = async (input = ""): Promise<void> => {
      const variables = { relatedToId, relationId, title: input };
      await addItem({
        variables,
        optimisticResponse: this.clientManager.optimisticCreateRelatedItem(
          variables
        ),
      });
    };

    return add;
  }

  useMakeDestroyItem(): (id: number) => () => Promise<void> {
    const [destroyItem] = useMutation<
      Data["destroyItem"],
      Variables["destroyItem"]
    >(nodes["destroyItem"], {
      update: this.clientManager.updateOnDestroyItem(),
    });

    const makeDestroy = (id: ItemId) => async (): Promise<void> => {
      const variables = { id };
      await destroyItem({
        variables,
        optimisticResponse: this.clientManager.optimisticDestroyItem(variables),
      });
    };

    return makeDestroy;
  }

  useItems(): UseItems<"items"> {
    return {
      ...this.useQuery<"items">("items"),
      add: this.useAddItem(),
      makeDestroy: this.useMakeDestroyItem(),
    };
  }

  useCoreItems(): {
    data?: Data["coreItems"];
    loading: boolean;
    error?: ApolloError;
  } {
    return this.useQuery<"coreItems">("coreItems");
  }

  useRelatedItems(
    relatedToId: ItemId,
    relationId: ItemId
  ): UseItems<"itemWithRelatedItems"> {
    const { data, loading, error } = useQuery<
      Data["itemWithRelatedItems"],
      Variables["itemWithRelatedItems"]
    >(nodes["itemWithRelatedItems"], {
      variables: { relatedToId, relationId },
      onCompleted: this.clientManager.onCompletedGetItemWithRelatedItems(),
    });

    const add = this.useAddRelatedItem(relatedToId, relationId);
    const makeDestroy = this.useMakeDestroyItem();

    return {
      data,
      loading,
      error,
      add,
      makeDestroy,
    };
  }
}
