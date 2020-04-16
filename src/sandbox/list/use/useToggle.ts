import { useState } from "react";

export const useToggle = (
  initialValue: boolean = false,
  cb?: (value: boolean) => void
) => {
  const [state, setState] = useState(initialValue);

  return cb
    ? {
        state,
        on: () => {
          setState(true);
          cb(true);
        },
        off: () => {
          setState(false);
          cb(false);
        },
        toggle: () => {
          const newState = !state;
          setState(newState);
          cb(newState);
        }
      }
    : {
        state,
        on: () => setState(true),
        off: () => setState(false),
        toggle: () => setState(!state)
      };
};

export default useToggle;
