import { useState, ChangeEvent, KeyboardEvent } from "react";

export const useInputValue = (initialValue = "") => {
  const [inputValue, setInputValue] = useState(initialValue);

  return {
    inputValue,
    changeInput: (event: ChangeEvent<HTMLInputElement>) =>
      setInputValue(event.target.value),
    clearInput: () => setInputValue(""),
    keyInput: (
      event: KeyboardEvent<HTMLInputElement>,
      callback: (value: string) => void
    ) => {
      if (event.key === "Enter") {
        callback(inputValue);
        return true;
      }

      return false;
    }
  };
};
