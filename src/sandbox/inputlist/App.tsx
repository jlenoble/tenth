import React from "react";
import { Item } from "../list";
import {
  ListCard as BaseListCard,
  withDnD,
  withCollection,
  withLocalStorage
} from "../list-card";
import { RequiredKeys } from "../../generics";

const todoListKey = "todolist";

const ListCard = withLocalStorage(withCollection(withDnD(BaseListCard)));

const validateLength = (value: string) => {
  const error = !Boolean(value.length);
  return error
    ? {
        error: true,
        helperText: "Please enter something or delete item"
      }
    : {};
};

const validatePrimary = (item: RequiredKeys<Item, "checked">) => {
  const { error, helperText: primaryHelperText } = validateLength(item.primary);
  return { ...item, error, primaryHelperText };
};

function App() {
  return (
    <ListCard
      ui={{ inlineEdit: true }}
      validators={{ validatePrimary }}
      localStorageId={todoListKey}
    />
  );
}

export default App;
