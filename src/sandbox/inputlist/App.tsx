import React from "react";
import { todoListKey } from "../../custom/InputList/__helpers__";

import { PersistentSortList as List } from "../../custom";

function App() {
  return (
    <List
      ui={{ addItem: true }}
      listItemUI={{ checkbox: true, deleteButton: true }}
      localStorageId={todoListKey}
    />
  );
}

export default App;
