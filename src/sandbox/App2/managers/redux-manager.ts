import {
  createStore,
  applyMiddleware,
  combineReducers,
  Middleware,
  Store,
} from "redux";
import { createLogger } from "redux-logger";
import { SagaGenerator } from "../../../generics";

import {
  currentPathReducer as currentPath,
  itemsReducer as items,
  nCardsReducer as nCards,
  relationshipsReducer as relationships,
  relationshipsForItemReducer as relationshipsForItem,
  viewsForItemReducer as viewsForItem,
  viewsForSubItemReducer as viewsForSubItem,
  getItem,
  getItemsById,
  getRelationshipsForItem,
  getRelationshipsForItemAndRelation,
  getRelationshipsForLeftItemAndRelation,
  getRelationshipsForRightItemAndRelation,
  removeItems,
  removeRelationships,
} from "../redux-reducers";

import { DataManager, Items, Relationships } from "./data-manager";
import { sagaMiddleware, SagaManager } from "./saga-manager";
import * as Sagas from "../sagas";

import {
  ItemId,
  ClientItem,
  ClientRelationship,
  UserId,
  ApolloClientManagerInterface,
} from "../types";

type SagaMap = { [key: string]: () => SagaGenerator };

export class ReduxManager extends DataManager<ClientItem, ClientRelationship> {
  public readonly store: Store;
  public readonly clientManager: ApolloClientManagerInterface;
  public readonly sagaManager: SagaManager;

  constructor({
    log = false,
    clientManager,
  }: {
    log?: boolean;
    clientManager: ApolloClientManagerInterface;
  }) {
    super();

    this.clientManager = clientManager;

    const middleWares: Middleware[] = [];

    if (log) {
      middleWares.push(createLogger({ collapsed: true }));
    }

    middleWares.push(sagaMiddleware);

    const reducers = {
      currentPath,
      items,
      nCards,
      relationships,
      relationshipsForItem,
      viewsForItem,
      viewsForSubItem,
    };

    this.store = createStore(
      combineReducers(reducers),
      applyMiddleware(...middleWares)
    );
    this.sagaManager = new SagaManager();

    Object.keys(Sagas).forEach((sagaName: keyof SagaMap) => {
      this.sagaManager.add(sagaName as string, (Sagas as SagaMap)[sagaName]);
    });
  }

  async getItem(id: ItemId): Promise<ClientItem> {
    const item = await this.clientManager.select(getItem(id));
    if (item) {
      return item;
    }
    throw new Error("No item in store: " + id);
  }

  async getItems(ids: ItemId[]): Promise<ClientItem[]> {
    const items = await this.clientManager.select(getItemsById(ids));
    return items;
  }

  async getRelationshipsForItem(id: ItemId): Promise<ClientRelationship[]> {
    return this.clientManager.select(getRelationshipsForItem(id));
  }

  async getRelationshipsForItemAndRelation(
    id: ItemId,
    relationId: ItemId
  ): Promise<ClientRelationship[]> {
    return this.clientManager.select(
      getRelationshipsForItemAndRelation({
        id,
        relationId,
      })
    );
  }

  async getRelationshipsForLeftItemAndRelation(
    relatedToId: ItemId,
    relationId: ItemId
  ): Promise<ClientRelationship[]> {
    return this.clientManager.select(
      getRelationshipsForLeftItemAndRelation({ relatedToId, relationId })
    );
  }

  async getRelationshipsForRightItemAndRelation(
    relatedId: ItemId,
    relationId: ItemId
  ): Promise<ClientRelationship[]> {
    return this.clientManager.select(
      getRelationshipsForRightItemAndRelation({
        relatedId,
        relationId,
      })
    );
  }

  getUserId(): Promise<UserId> {
    // -1, not 0, to handle tests on falsiness
    return Promise.resolve(-1);
  }

  async bulkDestroyItems(items: Items<ClientItem>): Promise<ClientItem[]> {
    await this.clientManager.dispatch(removeItems(Array.from(items.keys())));
    return Array.from(items.values());
  }

  async bulkDestroyRelationships(
    relationships: Relationships<ClientRelationship>
  ): Promise<ClientRelationship[]> {
    await this.clientManager.dispatch(
      removeRelationships(Array.from(relationships.keys()))
    );
    return Array.from(relationships.values());
  }
}
