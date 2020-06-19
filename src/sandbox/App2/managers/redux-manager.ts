import {
  createStore,
  applyMiddleware,
  combineReducers,
  Middleware,
  Store,
  Reducer,
  AnyAction,
  CombinedState,
} from "redux";
import { createLogger } from "redux-logger";
import { SagaGenerator } from "../../../generics";

import {
  currentPathReducer as currentPath,
  itemsReducer as items,
  nCardsReducer as nCards,
  ordersReducer as orders,
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
  RESET_ALL,
  ResetAllAction,
  updateItem,
  getItemByTitle,
  getRelationship,
  updateRelationship,
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
  State,
} from "../types";

type SagaMap = { [key: string]: () => SagaGenerator };

export class ReduxManager extends DataManager<ClientItem, ClientRelationship> {
  public readonly store: Store;
  public readonly clientManager: ApolloClientManagerInterface;
  public readonly sagaManager: SagaManager;
  public readonly combinedReducer: Reducer<CombinedState<State>, AnyAction>;

  private coreItemsByTitle: Map<string, ClientItem> = new Map();

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
      orders,
      relationships,
      relationshipsForItem,
      viewsForItem,
      viewsForSubItem,
    };

    this.combinedReducer = combineReducers(reducers);

    const appReducer: Reducer<CombinedState<State>, AnyAction> = (
      state,
      action
    ): CombinedState<State> => {
      if (action.type === RESET_ALL) {
        state = (action as ResetAllAction).payload.state;

        return {
          currentPath: currentPath(state.currentPath, action),
          items: items(state.items, action),
          nCards: nCards(state.nCards, action),
          orders: orders(state.orders, action),
          relationships: relationships(state.relationships, action),
          relationshipsForItem: relationshipsForItem(
            state.relationshipsForItem,
            action
          ),
          viewsForItem: viewsForItem(state.viewsForItem, action),
          viewsForSubItem: viewsForSubItem(state.viewsForSubItem, action),
        };
      }

      return this.combinedReducer(state, action);
    };

    this.store = createStore(appReducer, applyMiddleware(...middleWares));
    this.sagaManager = new SagaManager();

    Object.keys(Sagas).forEach((sagaName: keyof SagaMap) => {
      this.sagaManager.add(sagaName as string, (Sagas as SagaMap)[sagaName]);
    });
  }

  async findOrCreateRelatedItem(_item: {
    relatedToId: ItemId;
    relationId: ItemId;
    title: string;
  }): Promise<{
    item: ClientItem;
    relationship: ClientRelationship;
  }> {
    return { item: {}, relationship: {} };
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

  async bulkCreateRelationships(
    ids: ItemId[][]
  ): Promise<ClientRelationship[]> {
    // await this.clientManager.dispatch(
    //   addRelationships(Array.from(relationships.keys()))
    // );
    // return Array.from(relationships.values());
    return [];
  }

  async bulkDestroyRelationships(
    relationships: Relationships<ClientRelationship>
  ): Promise<ClientRelationship[]> {
    await this.clientManager.dispatch(
      removeRelationships(Array.from(relationships.keys()))
    );
    return Array.from(relationships.values());
  }

  getCoreItemId(title: string): ItemId | undefined {
    let item = this.coreItemsByTitle.get(title);
    if (item) {
      return item.id;
    }
    item = this.clientManager.select(getItemByTitle(title));
    if (item) {
      this.coreItemsByTitle.set(title, item);
      return item.id;
    }
  }

  async updateItem(item: ClientItem): Promise<ClientItem> {
    this.clientManager.dispatch(updateItem(item));
    return this.clientManager.select(getItem(item.id)) || item;
  }

  async updateRelationship(
    relationship: ClientRelationship
  ): Promise<ClientRelationship> {
    this.clientManager.dispatch(updateRelationship(relationship));
    return (
      this.clientManager.select(getRelationship(relationship.id)) ||
      relationship
    );
  }
}
