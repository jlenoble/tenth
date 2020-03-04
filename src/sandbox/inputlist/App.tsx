import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import InputList, { useItems } from "../../custom/InputList";
import {
  onDragEnd,
  todoListKey,
  saveItems
} from "../../custom/InputList/__helpers__";

import { DisplayList } from "../../custom";

// function App() {
//   const itemHooks = useItems(
//     JSON.parse(localStorage.getItem(todoListKey) || "[]"),
//     saveItems(todoListKey)
//   );

//   return (
//     <DragDropContext onDragEnd={onDragEnd(itemHooks)}>
//       <InputList dnd itemHooks={itemHooks} />
//     </DragDropContext>
//   );
// }

function App() {
  return (
    <DisplayList
      defaultItems={[
        { id: "1", text: "a", checked: true },
        { id: "2", text: "b", checked: true }
      ]}
      listId={"list0"}
    />
  );
}

export default App;
