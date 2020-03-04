import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import InputList from "../../custom/InputList";
import { useItems } from "../../core";
import {
  onDragEnd,
  todoListKey,
  saveItems
} from "../../custom/InputList/__helpers__";

// import { DisplayList as List } from "../../custom";

function App() {
  const itemHooks = useItems(
    JSON.parse(localStorage.getItem(todoListKey) || "[]"),
    saveItems(todoListKey)
  );

  return (
    <DragDropContext onDragEnd={onDragEnd(itemHooks)}>
      <InputList itemHooks={itemHooks} droppableId={"list0"} />
    </DragDropContext>
  );
}

// function App() {
//   return (
//     <List
//       defaultItems={[
//         { id: "1", text: "a", checked: true },
//         { id: "2", text: "b", checked: false },
//         { id: "3", text: "c", checked: true }
//       ]}
//       listId={"list0"}
//     />
//   );
// }

export default App;
