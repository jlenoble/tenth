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
  makeUpdate: (id: ItemId) => (title: string) => Promise<void>;
};

export class ApolloHooksManager {
  public readonly clientManager: ApolloClientManagerInterface;
  public readonly optimistManager: OptimistManager;
  public readonly updateManager: UpdateManager;
  public readonly completedManager: CompletedManager;

  constructor({
    clientManager,
    optimistManager,
    updateManager,
    completedManager,
  }: {
    clientManager: ApolloClientManagerInterface;
    optimistManager: OptimistManager;
    updateManager: UpdateManager;
    completedManager: CompletedManager;
  }) {
    this.clientManager = clientManager;
    this.optimistManager = optimistManager;
    this.updateManager = updateManager;
    this.completedManager = completedManager;
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
    const [_destroyItem] = useMutation<
      Data["destroyItem"],
      Variables["destroyItem"]
    >(nodes["destroyItem"], {
      update: this.updateManager.destroyItem(),
    });

    const makeDestroy = (id: ItemId) => async (): Promise<void> => {
      const _variables = { id };

      const {
        variables,
        optimisticResponse,
      } = this.optimistManager.destroyItem(_variables);

      try {
        await _destroyItem({
          variables,
          optimisticResponse,
        });
      } catch (e) {
        switch (e.message) {
          case "Network error: Failed to fetch": {
            if (optimisticResponse) {
              const { destroyItem: item, optimisticId } = optimisticResponse;
              this.clientManager.dispatch(
                destroyItem(
                  item,
                  typeof optimisticId === "number"
                    ? -optimisticId
                    : optimisticId,
                  true
                )
              );
            }
            throw new Error(`Network unavailable: Failed to delete "${id}"`);
          }

          default:
            throw e;
        }
      }
    };

    return makeDestroy;
  }

  useMakeUpdateItem(): (id: number) => (value: string) => Promise<void> {
    const [_updateItem] = useMutation<
      Data["updateItem"],
      Variables["updateItem"]
    >(nodes["updateItem"], {
      update: this.updateManager.updateItem(),
    });

    const makeUpdate = (id: ItemId) => async (title: string): Promise<void> => {
      const _variables = { id, title };

      const { variables, optimisticResponse } = this.optimistManager.updateItem(
        _variables
      );

      try {
        await _updateItem({
          variables,
          optimisticResponse,
        });
      } catch (e) {
        switch (e.message) {
          //       case "Network error: Failed to fetch": {
          //         if (optimisticResponse) {
          //           const { destroyItem: item, optimisticId } = optimisticResponse;
          //           this.clientManager.dispatch(
          //             destroyItem(
          //               item,
          //               typeof optimisticId === "number"
          //                 ? -optimisticId
          //                 : optimisticId,
          //               true
          //             )
          //           );
          //         }
          //         throw new Error(`Network unavailable: Failed to delete "${id}"`);
          //       }
          default:
            throw e;
        }
      }
    };

    return makeUpdate;
  }

  useItems(): UseItems<"items"> {
    return {
      ...this.useQuery<"items">("items"),
      add: this.useAddItem(),
      makeDestroy: this.useMakeDestroyItem(),
      makeUpdate: this.useMakeUpdateItem(),
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
      makeUpdate: this.useMakeUpdateItem(),
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
    const makeUpdate = this.useMakeUpdateItem();

    return {
      data,
      loading,
      error,
      add,
      makeDestroy,
      makeUpdate,
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
