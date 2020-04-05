import { useState, ChangeEvent, KeyboardEvent } from "react";

export const useInputValue = (cb: (value: string) => void) => {
  const [inputValue, setInputValue] = useState("");

  const changeInput = (event: ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const clearInputAndAdd = () => {
    setInputValue("");
    cb(inputValue);
  };

  const keyInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      clearInputAndAdd();
      return true;
    }

    return false;
  };

  return {
    inputValue,
    changeInput,
    clearInputAndAdd,
    keyInput
  };
};
