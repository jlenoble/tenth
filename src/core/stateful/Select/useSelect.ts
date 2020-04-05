import { useState } from "react";

export const useSelect = (
  initialValue: boolean,
  cb: (selected: boolean) => void
) => {
  const [selected, setSelected] = useState(initialValue);

  const select = () => {
    setSelected(true);
    cb(true);
  };
  const unselect = () => {
    setSelected(false);
    cb(false);
  };
  const toggle = () => {
    const unselected = !selected;
    setSelected(unselected);
    cb(unselected);
  };

  return {
    selected,
    select,
    unselect,
    toggle
  };
};
