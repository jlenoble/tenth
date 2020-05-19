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

  useAddItem(): (input?: string) => void {
    const [addItem] = this.useMutation<"createItem">("createItem", {
      update: this.clientManager.updateOnCreateItem(),
    });

    const add = (input = ""): void => {
      addItem({
        variables: { title: input },
        optimisticResponse: this.clientManager.optimisticCreateItem({
          title: input,
        }),
      });
    };

    return add;
  }

  useAddRelatedItem(
    relatedToId: ItemId,
    relationType: string
  ): (input?: string) => void {
    const [addItem] = useMutation<
      Data["createRelatedItem"],
      Variables["createRelatedItem"]
    >(nodes["createRelatedItem"], {
      update: this.clientManager.updateOnCreateRelatedItem(
        relatedToId,
        relationType
      ),
    });

    const add = (input = ""): void => {
      addItem({
        variables: { relatedToId, relationType, title: input },
        optimisticResponse: this.clientManager.optimisticCreateRelatedItem({
          title: input,
        }),
      });
    };

    return add;
  }

  useMakeDestroyItem(): (id: number) => () => void {
    const [destroyItem] = useMutation<
      Data["destroyItem"],
      Variables["destroyItem"]
    >(nodes["destroyItem"], {
      update: this.clientManager.updateOnDestroyItem(),
    });

    const makeDestroy = (id: ItemId) => (): void => {
      destroyItem({
        variables: { id },
        optimisticResponse: this.clientManager.optimisticDestroyItem({ id }),
      });
    };

    return makeDestroy;
  }

  useItems(): {
    data?: Data["items"];
    loading: boolean;
    error?: ApolloError;
    add: (input: string) => void;
    makeDestroy: (id: ItemId) => () => void;
  } {
    return {
      ...this.useQuery<"items">("items"),
      add: this.useAddItem(),
      makeDestroy: this.useMakeDestroyItem(),
    };
  }
}
