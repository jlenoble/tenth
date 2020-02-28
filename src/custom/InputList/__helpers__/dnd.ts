import { DropResult } from "react-beautiful-dnd";
import { useItems } from "..";

export const DROPPABLE_ATTRIBUTE = "[data-rbd-droppable-id]";
export const DRAGGABLE_ATTRIBUTE = "[data-rbd-draggable-id]";

export const getDroppable = (container: HTMLElement): HTMLElement | null => {
  return container.querySelector(DROPPABLE_ATTRIBUTE);
};

export const getDraggable = (container: HTMLElement): HTMLElement | null => {
  return container.querySelector(DRAGGABLE_ATTRIBUTE);
};

export const getDroppables = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll(DROPPABLE_ATTRIBUTE));
};

export const getDraggables = (container: HTMLElement): HTMLElement[] => {
  return Array.from(container.querySelectorAll(DRAGGABLE_ATTRIBUTE));
};

export const onDragEnd = ({
  items,
  setItems
}: ReturnType<typeof useItems>) => ({ source, destination }: DropResult) => {
  if (!destination) {
    return;
  }

  if (destination.droppableId === source.droppableId) {
    if (destination.index === source.index) {
      return;
    }

    const newItems = items.concat();
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, items[source.index]);

    setItems(newItems);
  }
};
