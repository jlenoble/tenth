import {
  Payload,
  Manager,
  ManagerProgenyHandler,
  ManagerRelationship
} from "./types";
import {
  addCreateSagas,
  addDestroySagas,
  addModifySagas,
  addSetSagas,
  addSetVisibilityFilterSagas
} from "./sagas";

export const makeManagerProgenyHandler = <T>(
  manager: Manager<T>,
  makeManager: <U>(managerId: string, parentManagerId?: string) => Manager<U>
): ManagerProgenyHandler<T> => {
  const children: Map<string, Manager<any>> = new Map();
  const managerId = manager.managerId;

  const addChild = <U>(
    childManagerId: string,
    {
      adaptToParent,
      adaptToChild,
      relationship,
      selectionId
    }: {
      adaptToParent?: (payload: Payload<U>) => Payload<T>;
      adaptToChild?: (payload: Payload<T>) => Payload<U>;
      relationship: ManagerRelationship;
      selectionId?: string;
    }
  ): Manager<U> => {
    if (children.has(childManagerId)) {
      return children.get(childManagerId)!;
    }

    const childManager = makeManager<U>(childManagerId, managerId);

    const sagaArgs = {
      manager,
      childManager,
      adaptToChild,
      adaptToParent,
      relationship,
      selectionId
    };

    addCreateSagas(sagaArgs);
    addDestroySagas(sagaArgs);
    addModifySagas(sagaArgs);
    addSetSagas(sagaArgs);
    addSetVisibilityFilterSagas(sagaArgs);

    children.set(childManagerId, childManager);

    return childManager;
  };

  const hasChild = (managerId: string) => children.has(managerId);
  const hasDescendant = (managerId: string) => {
    if (children.has(managerId)) {
      return true;
    }

    for (let manager of children.values()) {
      if (manager.progenyHandler.hasDescendant(managerId)) {
        return true;
      }
    }

    return false;
  };

  const hasChildren = () => Boolean(children.size);
  const hasDescendants = () => {
    if (Boolean(children.size)) {
      return true;
    }

    for (let manager of children.values()) {
      if (manager.progenyHandler.hasDescendants()) {
        return true;
      }
    }

    return false;
  };

  const getChild = (managerId: string) => children.get(managerId);
  const getDescendant = (managerId: string) => {
    if (children.has(managerId)) {
      return children.get(managerId);
    }

    for (let manager of children.values()) {
      let descendant = manager.progenyHandler.getDescendant(managerId);
      if (descendant) {
        return descendant;
      }
    }
  };

  const getChildren = () => Array.from(children.values());
  const getDescendants = () => {
    let descendants: Manager<any>[] = [];

    for (let manager of children.values()) {
      descendants.push(manager);

      if (manager.progenyHandler.hasChildren()) {
        descendants = descendants.concat(
          manager.progenyHandler.getDescendants()
        );
      }
    }

    return descendants;
  };

  return {
    addChild,
    hasChild,
    hasDescendant,
    hasChildren,
    hasDescendants,
    getChild,
    getDescendant,
    getChildren,
    getDescendants
  };
};
