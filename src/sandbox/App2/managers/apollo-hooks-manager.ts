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

import { OptimistManager } from "./optimist-manager";
import { UpdateManager } from "./update-manager";
import { CompletedManager } from "./completed-manager";
import { destroyItem } from "../redux-reducers";

type UseItems<Key extends keyof Data> = {
  data?: Data[Key];
  loading: boolean;
  error?: ApolloError;
  add: (input: string) => Promise<void>;
  makeDestroy: (id: ItemId) => () => Promise<void>;
};

export class ApolloHooksManager {
  public readonly clientManager: ApolloClientManagerInterface;
  public readonly optimistManager: OptimistManager;
  public readonly updateManager: UpdateManager;
  public readonly completedManager: CompletedManager;

  constructor(clientManager: ApolloClientManagerInterface) {
    this.clientManager = clientManager;
    this.optimistManager = clientManager.optimistManager;
    this.updateManager = clientManager.updateManager;
    this.completedManager = clientManager.completedManager;
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
      update: this.updateManager.createItem(),
    });

    const add = async (input = ""): Promise<void> => {
      const variables = { title: input };
      await addItem(this.optimistManager.createItem(variables));
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
      update: this.updateManager.createRelatedItem(),
    });

    const add = async (input = ""): Promise<void> => {
      const _variables = {
        relatedToId,
        relationId,
        title: input,
      };

      const {
        variables,
        optimisticResponse,
      } = this.optimistManager.createRelatedItem(_variables);

      try {
        await addItem({
          variables,
          optimisticResponse,
        });
      } catch (e) {
        switch (e.message) {
          case "Network error: Failed to fetch":
            throw new Error(`Network unavailable: Failed to add "${input}"`);

          default:
            throw e;
        }
      } finally {
        if (optimisticResponse) {
          // Destroy in cascade tmp item and relationship and their refs.
          // Apollo has already updated/reverted the UI. All tmp elements are already unmounted.
          this.clientManager.dispatch(
            destroyItem(optimisticResponse.createRelatedItem.item)
          );
        }
      }
    };

    return add;
  }

  useMakeDestroyItem(): (id: number) => () => Promise<void> {
    const [destroyItem] = useMutation<
      Data["destroyItem"],
      Variables["destroyItem"]
    >(nodes["destroyItem"], {
      update: this.updateManager.destroyItem(),
    });

    const makeDestroy = (id: ItemId) => async (): Promise<void> => {
      const variables = { id };
      await destroyItem(this.optimistManager.destroyItem(variables));
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
        onCompleted: this.completedManager.getItemsById(),
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
    const { data, loading, error } = useQuery<
      Data["itemWithRelatedItems"],
      Variables["itemWithRelatedItems"]
    >(nodes["itemWithRelatedItems"], {
      variables: { relatedToId, relationId },
      onCompleted: this.completedManager.getItemWithRelatedItems(),
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

  useBreadcrumbs(
    currentPath: ItemId[]
  ): {
    friendlyCurrentPath: string[];
  } {
    const { data, loading, error } = this.useItemsById(currentPath);

    if (!loading && !error && data) {
      return {
        friendlyCurrentPath: currentPath.map((id) => {
          const item = data.itemsById.find((item) => item.id === id);
          return item?.title || "" + id;
        }),
      };
    }

    return { friendlyCurrentPath: [] };
  }
}
