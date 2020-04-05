import { useState, ChangeEvent, KeyboardEvent } from "react";

export const useEditValue = (
  initialValue: string,
  update: (value: string) => void
) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [edited, setEdited] = useState(false);

  const changeInput = (event: ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const edit = () => setEdited(true);
  const stopEditing = () => setEdited(false);

  const keyInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      update(inputValue);
      stopEditing();
      return true;
    }

    return false;
  };

  return {
    inputValue,
    edited,
    changeInput,
    keyInput,
    edit,
    stopEditing
  };
};
