import { ApolloError } from "apollo-client";
import { QueryResult } from "@apollo/react-common";
import {
  useQuery,
  useMutation,
  QueryHookOptions,
  MutationHookOptions,
  MutationTuple,
} from "@apollo/react-hooks";
import { useDispatch, useSelector } from "react-redux";

import { nodes } from "../client/graphql-nodes";
import {
  ItemId,
  Data,
  Variables,
  ApolloClientManagerInterface,
} from "../types";
import { getCurrentPath } from "../redux-reducers";

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
    const dispatch = useDispatch();

    const [addItem] = this.useMutation<"createItem">("createItem", {
      update: this.clientManager.updateOnCreateItem(dispatch),
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
    const dispatch = useDispatch();

    const [addItem] = useMutation<
      Data["createRelatedItem"],
      Variables["createRelatedItem"]
    >(nodes["createRelatedItem"], {
      update: this.clientManager.updateOnCreateRelatedItem(dispatch),
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
    const dispatch = useDispatch();

    const [destroyItem] = useMutation<
      Data["destroyItem"],
      Variables["destroyItem"]
    >(nodes["destroyItem"], {
      update: this.clientManager.updateOnDestroyItem(dispatch),
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

  useItemsById(ids: ItemId[]): UseItems<"itemsById"> {
    return {
      ...this.useQuery<"itemsById">("itemsById", {
        variables: { ids },
      }),
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
    const dispatch = useDispatch();

    const { data, loading, error } = useQuery<
      Data["itemWithRelatedItems"],
      Variables["itemWithRelatedItems"]
    >(nodes["itemWithRelatedItems"], {
      variables: { relatedToId, relationId },
      onCompleted: this.clientManager.onCompletedGetItemWithRelatedItems(
        dispatch
      ),
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

  useBreadcrumbs(): {
    currentPath: ItemId[];
    friendlyCurrentPath: string[];
  } {
    const currentPath = useSelector(getCurrentPath);
    const { data, loading, error } = this.useItemsById(currentPath);

    if (!loading && !error && data) {
      return {
        currentPath,
        friendlyCurrentPath: currentPath.map((id) => {
          const item = data.itemsById.find((item) => item.id === id);
          return item?.title || "" + id;
        }),
      };
    }

    return { currentPath, friendlyCurrentPath: [] };
  }
}
