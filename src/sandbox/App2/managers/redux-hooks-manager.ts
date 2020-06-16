import { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";

import { ItemId, ApolloClientManagerInterface } from "../types";
import {
  getCurrentPathAndNCards,
  deepenCurrentPath,
  moveBackCurrentPath,
  setCurrentPath,
  setCurrentPathToSiblingPath,
  incrementNCards,
  decrementNCards,
} from "../redux-reducers";

type UseOneCard = {
  itemId: ItemId;
  currentPath: ItemId[];
  close: () => void;
  open: (id: ItemId) => void;
  moveBack: (id: ItemId) => () => void;
};

export class ReduxHooksManager {
  public readonly clientManager: ApolloClientManagerInterface;

  constructor(clientManager: ApolloClientManagerInterface) {
    this.clientManager = clientManager;
  }

  useOneCard(path: ItemId[], first: boolean): UseOneCard {
    const [currentPath, _setCurrentPath] = useState(path);
    const index = currentPath.length - 1;
    const itemId = currentPath[index] || 1;

    const moveBack = first
      ? (index: number) => () => {
          const newPath = currentPath.slice(0, index + 1);
          _setCurrentPath(newPath);
          this.clientManager.dispatch(setCurrentPath(newPath));
        }
      : (index: number) => () => {
          _setCurrentPath(currentPath.slice(0, index + 1));
        };

    const close = first
      ? () => {
          if (index > 0) {
            const newPath = currentPath.slice(0, index);
            _setCurrentPath(newPath);
            this.clientManager.dispatch(setCurrentPath(newPath));
          }
        }
      : () => {
          if (index > 0) {
            _setCurrentPath(currentPath.slice(0, index));
          }
        };

    const open = first
      ? (id: ItemId) => {
          const newPath = currentPath.concat(id);
          _setCurrentPath(newPath);
          this.clientManager.dispatch(setCurrentPath(newPath));
        }
      : (id: ItemId) => {
          _setCurrentPath(currentPath.concat(id));
        };

    return {
      itemId,
      currentPath,
      close,
      open,
      moveBack,
    };
  }

  useTwoOneCards(
    path: ItemId[]
  ): {
    pathProps1: UseOneCard;
    pathProps2: UseOneCard;
  } {
    const pathProps1 = this.useOneCard(path, true);
    const pathProps2 = this.useOneCard(path, false);

    return {
      pathProps1,
      pathProps2,
    };
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
