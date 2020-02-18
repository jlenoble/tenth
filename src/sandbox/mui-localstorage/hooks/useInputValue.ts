import { useState, ChangeEvent, KeyboardEvent } from "react";

const useInputValue = (initialValue = "") => {
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
      if (event.which === 13 || event.keyCode === 13) {
        callback(inputValue);
        return true;
      }

      return false;
    }
  };
};

export default useInputValue;
