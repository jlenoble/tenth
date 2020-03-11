import { DropResult } from "react-beautiful-dnd";
import { ItemHooks } from "../../../core";

export const onDragEnd = ({ items = [], setItems }: ItemHooks) =>
  setItems
    ? ({ source, destination }: DropResult) => {
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
      }
    : () => {};
