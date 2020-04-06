import { useState, ChangeEvent, KeyboardEvent } from "react";
import { useOnOff } from "../OnOff/useOnOff";

export const useEditValue = (
  initialValue: string,
  cb: (value: string) => void
) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const { state: edited, on: edit, off: stopEditing } = useOnOff();

  const changeInput = (event: ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const keyInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      cb(inputValue);
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
