import { ApolloClient, ApolloClientOptions } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

import { ItemAPI } from "../server/api";
import { GQLItem } from "../types";

import {
  MutationCreateItemArgs,
  MutationUpdateItemArgs,
  MutationDestroyItemArgs,
  QueryItemArgs,
  CreateItemMutation,
  CreateRelatedItemMutation,
  CreateItemMutationVariables,
} from "../__generated__";

let id = 0;
const tmpId = (): number => --id;

type ItemManager = Omit<ItemAPI, "initialize">;

export class ApolloClientManager implements ItemManager {
  public readonly client: ApolloClient<NormalizedCacheObject>;

  constructor({ cache, link }: ApolloClientOptions<NormalizedCacheObject>) {
    this.client = new ApolloClient({
      cache,
      link,
    });
  }

  tmpItem(title: string): Pick<GQLItem, "__typename" | "id" | "title"> {
    return {
      __typename: "Item",
      id: tmpId(),
      title,
    };
  }

  optimisticItem({ title }: CreateItemMutationVariables): CreateItemMutation {
    return {
      __typename: "Mutation",
      createItem: this.tmpItem(title),
    };
  }

  optimisticRelatedItem({
    title,
  }: CreateItemMutationVariables): CreateRelatedItemMutation {
    return {
      __typename: "Mutation",
      createRelatedItem: this.tmpItem(title),
    };
  }

  createItem({ title }: MutationCreateItemArgs): Promise<GQLItem> {}
  updateItem({ id, ...args }: MutationUpdateItemArgs): Promise<GQLItem> {}
  destroyItem({ id }: MutationDestroyItemArgs): Promise<GQLItem> {}
  getAllItems(): Promise<GQLItem[]> {}
  getItemById({ id }: QueryItemArgs): Promise<GQLItem | null> {}
}
