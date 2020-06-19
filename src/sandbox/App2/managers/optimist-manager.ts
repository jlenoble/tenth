import { AnyAction } from "redux";
import {
  State,
  Variables,
  Data,
  ApolloClientManagerInterface,
  MetaAction,
  OptimisticAction,
  PreOptimisticAction,
  BEGIN,
  COMMIT,
  REVERT,
  ClientItem,
  ClientRelationship,
  ItemId,
} from "../types";
import {
  doNothing,
  resetAll,
  REVERT_DESTROY_ITEM,
  RevertDestroyItemAction,
  getOrderRelation,
  getOrderRelationship,
  getLastOrderedItem,
} from "../redux-reducers";

type Mutations =
  | "createItem"
  | "destroyItem"
  | "updateItem"
  | "createRelatedItem"
  | "createOrderedItem"
  | "updateRelationship";

type OptimisticInit<T extends Mutations> = {
  optimisticResponse?: Data[T];
  variables: Variables[T];
};

let _id = 0;
const tmpId = (): number => --_id;

enum Response {
  revert = -2,
  commit = -1,
}

type Undo = { items: ClientItem[]; relationships: ClientRelationship[] };

export class OptimistManager {
  public readonly clientManager: ApolloClientManagerInterface;

  private readonly enabled: boolean;
  private beforeState: State | undefined;
  private readonly history: AnyAction[];
  private readonly pendingActions: Map<number, number>;
  private nCompletedActions: number;
  private lastCompletedActions: Set<number>;
  private undoChanges: Map<number, AnyAction>;

  constructor({
    enabled = true,
    clientManager,
  }: {
    enabled: boolean;
    clientManager: ApolloClientManagerInterface;
  }) {
    this.enabled = enabled;
    this.clientManager = clientManager;
    this.beforeState = undefined;
    this.history = [];
    this.pendingActions = new Map();
    this.nCompletedActions = 0;
    this.lastCompletedActions = new Set();
    this.undoChanges = new Map();
  }

  setUndoChange(optimisticId: number, action: AnyAction): void {
    if (!this.undoChanges.has(optimisticId)) {
      this.undoChanges.set(optimisticId, action);
    }
  }

  isPreOptimisticAction(
    action: AnyAction
  ): action is PreOptimisticAction<AnyAction> {
    const { optimisticId, error } = action.meta || {};
    return (
      typeof optimisticId === "number" &&
      (error === true || error === undefined)
    );
  }

  isOptimisticAction(action: AnyAction): action is OptimisticAction<AnyAction> {
    const { id, type, index } = action.meta?.optimist || {};
    return (
      typeof id === "number" &&
      (type === BEGIN || type === COMMIT || type === REVERT) &&
      typeof index === "number"
    );
  }

  assertActionConsistency(
    prevAction: AnyAction,
    action: OptimisticAction<AnyAction>
  ): void {
    if (this.isOptimisticAction(prevAction)) {
      if (
        prevAction.type === action.type &&
        prevAction.meta.optimist.id === action.meta.optimist.id
      ) {
        return;
      }
    }

    throw new Error("Inconsistent actions");
  }

  collectRevertViews(reverted: number[], state: State): Set<string> {
    const views: Set<string> = new Set();
    const addView = (id: ItemId): void => {
      const viewsForItem = state.viewsForItem.get(id);
      const viewsForSubItem = state.viewsForSubItem.get(id);

      if (viewsForItem) {
        for (const view of viewsForItem) {
          views.add(view);
        }
      }

      if (viewsForSubItem) {
        for (const view of viewsForSubItem) {
          views.add(view);
        }
      }
    };

    reverted.forEach((optimisticId) => {
      const action = this.undoChanges.get(optimisticId) || doNothing();

      switch (action.type) {
        case REVERT_DESTROY_ITEM: {
          const { items } = (action as RevertDestroyItemAction).payload;
          items.forEach(({ id }) => addView(id));
        }
      }
    });

    return views;
  }

  wrapUpCurrentBatch(action: AnyAction): void {
    const reverted = Array.from(this.pendingActions.entries())
      .filter(([, index]) => index === Response.revert)
      .map(([id]) => id);

    if (!reverted.length) {
      Object.assign(action, doNothing());
    } else if (reverted.length === this.pendingActions.size) {
      Object.assign(
        action,
        this.beforeState
          ? resetAll(
              this.collectRevertViews(reverted, this.beforeState),
              this.beforeState
            )
          : doNothing()
      );
    } else if (this.beforeState) {
      this.beforeState = this.history.reduce(
        this.clientManager.reduxManager.combinedReducer,
        this.beforeState
      ) as State;
      Object.assign(
        action,
        resetAll(
          this.collectRevertViews(reverted, this.beforeState),
          this.beforeState
        )
      );
    }

    this.history.length = 0;
    this.lastCompletedActions = new Set(this.pendingActions.keys());
    this.nCompletedActions = 0;
    this.pendingActions.clear();
    this.beforeState = undefined;
    this.undoChanges.clear();
  }

  updateHistory(index: number, nextIndex: number, rollback = false): void {
    if (index > 0 && !rollback) {
      delete (this.history[index] as OptimisticAction<AnyAction>).meta.optimist;
      return;
    }

    const delta = nextIndex - index;
    this.history.splice(index, nextIndex);
    this.history.forEach((action, i) => {
      if (i >= index && this.isOptimisticAction(action)) {
        const optimist = action.meta.optimist;
        const { index, id } = optimist;
        const idx = index - delta;
        action.meta.optimist = { ...optimist, index: idx };
        this.pendingActions.set(id, idx);
      }
    });
  }

  reduceBeforeState(index: number, nextIndex: number, rollback = false): void {
    if (rollback) {
      return;
    }

    if (this.beforeState) {
      this.beforeState = this.history
        .slice(index, nextIndex)
        .reduce(
          this.clientManager.reduxManager.combinedReducer,
          this.beforeState
        );
    }
  }

  handleResponse(action: OptimisticAction<AnyAction>): void {
    const { id, type, index } = action.meta.optimist;
    const rollback = type === REVERT;
    const prevAction = this.history[index];

    this.assertActionConsistency(prevAction, action);
    this.nCompletedActions++;
    this.pendingActions.set(id, rollback ? Response.revert : Response.commit);

    if (this.pendingActions.size === this.nCompletedActions) {
      this.wrapUpCurrentBatch(action);
      return;
    }

    const nextIndex = this.history.findIndex((action, i) => {
      return i > index && this.isOptimisticAction(action);
    });

    if (nextIndex === -1) {
      this.wrapUpCurrentBatch(action);
      return;
    }

    this.reduceBeforeState(index, nextIndex, rollback);
    this.updateHistory(index, nextIndex, rollback);
  }

  optimisticAction<TAction extends AnyAction>(
    action: TAction
  ): MetaAction<TAction> {
    if (this.enabled) {
      const isPending = false;
      let isOptimisticReupdateByApollo = false;

      if (this.isPreOptimisticAction(action)) {
        const { optimisticId: _optimisticId, error } = action.meta;
        const isOptimisticUpdate = _optimisticId < 0;

        const optimisticId = isOptimisticUpdate
          ? -_optimisticId
          : _optimisticId;

        const index = this.pendingActions.get(optimisticId);
        const hasBegun = index !== undefined;
        const isFinished = index && index < 0;
        const isPending = hasBegun && !isFinished;

        let firstOptimisticId = -1;

        if (this.history.length) {
          const firstAction = this.history[0];
          if (this.isOptimisticAction(firstAction)) {
            firstOptimisticId = firstAction.meta.optimist.id;
          }
        }

        // When a server response is received, all but the answered request are
        // optimisticly reupdated by Apollo; This has the potential to leave the
        // Redux store in an inconsistent state, so we always check for that.
        // To help make the distinction, optimistic ids are always sent to the server
        // as negative numbers and returned as their positive counterpart.
        // If <0, we know we may have a reupdate: We must check on the first begun action
        // not yet completed. Since optimistic ids always increase in absolute value,
        // a reupdate have a strictly smaller id or it is pending.
        // But this is not enough, last reupdates may be trailing after the last answer
        // has been received, so we keep track of the previous batch of requests.
        isOptimisticReupdateByApollo =
          (isOptimisticUpdate &&
            (isPending || (isFinished && optimisticId < firstOptimisticId))) ||
          this.lastCompletedActions.has(optimisticId);

        if (!isOptimisticReupdateByApollo) {
          if (isPending) {
            let index = this.pendingActions.get(optimisticId);
            if (index === undefined) {
              index = error ? Response.revert : Response.commit;
            }

            action = {
              ...action,
              meta: {
                ...action.meta,
                optimist: {
                  id: optimisticId,
                  type: error ? REVERT : COMMIT,
                  index,
                },
              },
            };
          } else {
            action = {
              ...action,
              meta: {
                ...action.meta,
                optimist: {
                  id: optimisticId,
                  type: BEGIN,
                  index: this.history.length,
                },
              },
            };
          }
        }
      }

      if (!isOptimisticReupdateByApollo) {
        if (this.isOptimisticAction(action)) {
          const { id, type, index } = action.meta.optimist;

          if (type === BEGIN) {
            if (index !== this.history.length) {
              throw new Error(
                "When passing an optimistic action directly, index must be consistent with history"
              );
            }

            if (!isPending) {
              this.pendingActions.set(id, index);
            } else {
              throw new Error(
                `Cannot begin: Optimistic action "${id}" has already begun`
              );
            }

            if (!this.beforeState) {
              if (this.history.length) {
                throw new Error("Cannot have history w/o beforState");
              }

              this.beforeState = this.clientManager.store.getState();
            }

            this.history.push(action);
          } else if (index !== -1 && (type === COMMIT || type === REVERT)) {
            this.handleResponse(action);
          }
        } else if (this.history.length) {
          this.history.push(action);
        }
      }
    }

    return {
      ...action,
      meta: { ...action.meta, manager: this.clientManager },
    };
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

  updateItem(item: Variables["updateItem"]): OptimisticInit<"updateItem"> {
    return this.optimisticInit<"updateItem">(item, {
      __typename: "Mutation",
      updateItem: {
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

  createOrderedItem(
    variables: Variables["createOrderedItem"]
  ): OptimisticInit<"createOrderedItem"> {
    const { relatedToId, relationId, ...item } = variables;
    const relatedId = tmpId();
    const order: ClientItem = this.clientManager.select(
      getOrderRelation(relatedToId)
    ) || {
      id: tmpId(),
      title: ">",
    };
    const orderRelationship: ClientRelationship = this.clientManager.select(
      getOrderRelationship(relatedToId)
    ) || { id: tmpId(), ids: [relatedToId, relationId, order.id] };
    const lastItem: ClientItem = this.clientManager.select(
      getLastOrderedItem(relatedToId)
    ) || { id: tmpId(), title: "" };

    return this.optimisticInit<"createOrderedItem">(variables, {
      __typename: "Mutation",
      createOrderedItem: {
        __typename: "OrderedItem",
        item: {
          __typename: "Item",
          id: relatedId,
          ...item,
        },
        order: { __typename: "Item", ...order },
        orderRelationship: {
          __typename: "Relationship",
          ...orderRelationship,
        },
        relationships: [
          {
            __typename: "Relationship",
            id: tmpId(),
            ids: [lastItem.id, order.id, relatedId],
          },
        ],
      },
    });
  }

  updateRelationship(
    relationship: Variables["updateRelationship"]
  ): OptimisticInit<"updateRelationship"> {
    return this.optimisticInit<"updateRelationship">(relationship, {
      __typename: "Mutation",
      updateRelationship: {
        __typename: "Relationship",
        ...relationship,
      },
    });
  }
}
