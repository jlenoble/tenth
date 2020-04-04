import { useState, ChangeEvent, KeyboardEvent } from "react";

export const useInputValue = (add: (value: string) => void) => {
  const [inputValue, setInputValue] = useState("");

  const changeInput = (event: ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const clearInputAndAdd = () => {
    setInputValue("");
    add(inputValue);
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
