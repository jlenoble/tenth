import { DropResult } from "react-beautiful-dnd";
import { useItems, Item } from "..";

export const listId = "todolist";

export const saveItems = (listId: string) => (items: Item[]) => {
  localStorage.setItem(listId, JSON.stringify(items));
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
