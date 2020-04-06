import { useState } from "react";

export const useOnOff = (
  initialValue: boolean = false,
  cb?: (value: boolean) => void
) => {
  const [state, setState] = useState(initialValue);

  return {
    state,
    on: () => {
      setState(true);
      if (cb) cb(true);
    },
    off: () => {
      setState(false);
      if (cb) cb(false);
    },
    toggle: () => {
      const newState = !state;
      setState(newState);
      if (cb) cb(newState);
    }
  };
};
