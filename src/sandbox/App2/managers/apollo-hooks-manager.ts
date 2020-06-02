import { ApolloError } from "apollo-client";
import { QueryResult } from "@apollo/react-common";
import {
  useQuery,
  useMutation,
  QueryHookOptions,
  MutationHookOptions,
  MutationTuple,
} from "@apollo/react-hooks";
import { Store } from "redux";
import { useSelector, shallowEqual } from "react-redux";

import { nodes } from "../client/graphql-nodes";
import {
  ItemId,
  Data,
  Variables,
  ApolloClientManagerInterface,
} from "../types";
import {
  getCurrentPath,
  getCurrentPathAndNCards,
  deepenCurrentPath,
  moveBackCurrentPath,
  setCurrentPath,
  setCurrentPathToSiblingPath,
  incrementNCards,
  decrementNCards,
} from "../redux-reducers";
import { OptimistManager } from "./optimist-manager";
import { UpdateManager } from "./update-manager";
import { CompletedManager } from "./completed-manager";

type UseItems<Key extends keyof Data> = {
  data?: Data[Key];
  loading: boolean;
  error?: ApolloError;
  add: (input: string) => Promise<void>;
  makeDestroy: (id: ItemId) => () => Promise<void>;
};

export class ApolloHooksManager {
  public readonly clientManager: ApolloClientManagerInterface;
  public readonly store: Store;
  public readonly optimistManager: OptimistManager;
  public readonly updateManager: UpdateManager;
  public readonly completedManager: CompletedManager;

  constructor(clientManager: ApolloClientManagerInterface) {
    this.clientManager = clientManager;
    this.store = clientManager.store;
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
      await addItem({
        variables,
        optimisticResponse: this.optimistManager.createItem(variables),
      });
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
      const variables = { relatedToId, relationId, title: input };
      await addItem({
        variables,
        optimisticResponse: this.optimistManager.createRelatedItem(variables),
      });
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
      await destroyItem({
        variables,
        optimisticResponse: this.optimistManager.destroyItem(variables),
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

  useTwoCards(): {
    currentPath: ItemId[];
    leftItemId: ItemId;
    rightItemId: ItemId;
    rightOpened: boolean;
    closeLeft: () => void;
    openRight: (id: ItemId) => void;
    closeRight: () => void;
    openRightRight: (id: ItemId) => void;
    moveBack: (id: ItemId) => () => void;
  } {
    const { currentPath, nCards } = useSelector(
      getCurrentPathAndNCards,
      shallowEqual
    );
    const rightOpened = nCards > 1 && currentPath.length > 1;
    const [leftItemId, rightItemId] = rightOpened
      ? [
          currentPath[currentPath.length - 2],
          currentPath[currentPath.length - 1],
        ]
      : [currentPath[currentPath.length - 1], 0];

    const closeLeft = () => {
      if (rightOpened) {
        this.clientManager.dispatch(decrementNCards());
      } else {
        this.clientManager.dispatch(moveBackCurrentPath());
      }
    };

    const openRight = (id: ItemId) => {
      if (rightOpened) {
        this.clientManager.dispatch(setCurrentPathToSiblingPath(id));
      } else {
        this.clientManager.dispatch(incrementNCards());
        this.clientManager.dispatch(deepenCurrentPath(id));
      }
    };

    const closeRight = () => {
      this.clientManager.dispatch(decrementNCards());
      this.clientManager.dispatch(moveBackCurrentPath());
    };

    const openRightRight = (id: ItemId) => {
      this.clientManager.dispatch(deepenCurrentPath(id));
    };

    const moveBack = (index: number) => () => {
      if (index === 0) {
        this.clientManager.dispatch(decrementNCards());
      }
      this.clientManager.dispatch(
        setCurrentPath(currentPath.slice(0, index + 1))
      );
    };

    return {
      currentPath,
      leftItemId,
      rightItemId,
      rightOpened,
      closeLeft,
      openRight,
      closeRight,
      openRightRight,
      moveBack,
    };
  }
}
