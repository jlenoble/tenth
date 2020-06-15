import { FetchResult } from "apollo-link";
import { DataProxy } from "apollo-cache";

import { Data, ApolloClientManagerInterface } from "../types";
import {
  triggerCreateRelatedItem,
  triggerDestroyItem,
  triggerUpdateItem,
  triggerUpdateRelationship,
} from "../redux-reducers";

export class UpdateManager {
  public readonly clientManager: ApolloClientManagerInterface;

  constructor({
    clientManager,
  }: {
    clientManager: ApolloClientManagerInterface;
  }) {
    this.clientManager = clientManager;
  }

  createItem() {
    return (_: DataProxy, { data }: FetchResult<Data["createItem"]>): void => {
      const createItem = data?.createItem;
      if (createItem !== undefined) {
        console.log("updateOnCreateItem", createItem);
        // this._addItem(createItem);
      }
    };
  }

  destroyItem() {
    return (_: DataProxy, { data }: FetchResult<Data["destroyItem"]>): void => {
      const item = data?.destroyItem;

      if (item !== undefined) {
        this.clientManager.dispatch(
          triggerDestroyItem(item, data?.optimisticId)
        );
      }
    };
  }

  updateItem() {
    return (_: DataProxy, { data }: FetchResult<Data["updateItem"]>): void => {
      const item = data?.updateItem;

      if (item !== undefined) {
        this.clientManager.dispatch(
          triggerUpdateItem(item, data?.optimisticId)
        );
      }
    };
  }

  createRelatedItem() {
    return (
      _: DataProxy,
      { data }: FetchResult<Data["createRelatedItem"]>
    ): void => {
      const item = data?.createRelatedItem;

      if (item !== undefined) {
        this.clientManager.dispatch(triggerCreateRelatedItem(item));
      }
    };
  }

  updateRelationship() {
    return (
      _: DataProxy,
      { data }: FetchResult<Data["updateRelationship"]>
    ): void => {
      const relationship = data?.updateRelationship;

      if (relationship !== undefined) {
        this.clientManager.dispatch(
          triggerUpdateRelationship(relationship, data?.optimisticId)
        );
      }
    };
  }
}
