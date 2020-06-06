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
} from "../types";

type Mutations = "createItem" | "destroyItem" | "createRelatedItem";

type OptimisticInit<T extends Mutations> = {
  optimisticResponse?: Data[T];
  variables: Variables[T];
};

let _id = 0;
const tmpId = (): number => --_id;

export class OptimistManager {
  public readonly clientManager: ApolloClientManagerInterface;

  private readonly enabled: boolean;
  private beforeState: State | undefined;
  private readonly history: AnyAction[];
  private readonly begunActions: Map<number, number>;
  private readonly completedActions: Set<number>;

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
    this.begunActions = new Map();
    this.completedActions = new Set();
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

  clearHistory(): void {
    this.history.length = 0;
    this.begunActions.clear();
    this.completedActions.clear();
    this.beforeState = undefined;
  }

  optimisticAction<TAction extends AnyAction>(
    action: TAction
  ): MetaAction<TAction> {
    if (this.enabled) {
      let isOptimisticReupdateByApollo = false;

      if (this.isPreOptimisticAction(action)) {
        const { optimisticId: _optimisticId, error } = action.meta;

        const isOptimisticUpdate = _optimisticId < 0;

        const optimisticId = isOptimisticUpdate
          ? -_optimisticId
          : _optimisticId;

        const isPending =
          this.begunActions.has(optimisticId) &&
          !this.completedActions.has(optimisticId);

        isOptimisticReupdateByApollo = isOptimisticUpdate && !isPending;

        if (!isOptimisticReupdateByApollo) {
          if (isPending) {
            let index = this.begunActions.get(optimisticId);
            if (index === undefined) {
              index = -1;
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

          switch (type) {
            case BEGIN: {
              if (index !== this.history.length) {
                throw new Error(
                  "When passing an optimistic action directly, index must be consistent with history"
                );
              }

              if (
                !this.begunActions.has(id) &&
                !this.completedActions.has(id)
              ) {
                this.begunActions.set(id, index);
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

              break;
            }

            case COMMIT: {
              if (index !== -1) {
                const prevAction = this.history[index];

                this.assertActionConsistency(prevAction, action);

                delete prevAction.meta.optimist;

                if (index === 0) {
                  if (this.begunActions.size === this.completedActions.size) {
                    this.clearHistory();
                    break;
                  }

                  const nextIndex = this.history.findIndex((action) => {
                    return this.isOptimisticAction(action);
                  });

                  if (nextIndex === -1) {
                    this.clearHistory();
                    break;
                  }

                  if (this.beforeState) {
                    this.beforeState = this.history
                      .slice(0, nextIndex)
                      .reduce(
                        this.clientManager.reduxManager.combinedReducer,
                        this.beforeState
                      );
                  }

                  this.history.splice(0, nextIndex);
                  this.history.forEach((action) => {
                    if (this.isOptimisticAction(action)) {
                      const optimist = action.meta.optimist;
                      const { index, id } = optimist;
                      const idx = index - nextIndex;
                      action.meta.optimist = { ...optimist, index: idx };
                      this.begunActions.set(id, idx);
                    }
                  });
                }

                this.begunActions.set(id, -1);
                this.completedActions.add(id);
              }

              break;
            }

            case REVERT: {
              if (index !== -1) {
                this.assertActionConsistency(this.history[index], action);
              }
              // if REVERT, find index and from last to index, do revert actions for ui/apollo and reset state
              break;
            }

            default: {
              throw new Error(`"${type}" is not an optimistic type`);
            }
          }
        } else {
          if (this.history.length) {
            this.history.push(action);
          }
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
}
