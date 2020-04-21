const DELETE_BUTTON_ATTRIBUTE = `[aria-label="Delete item"]`;
const EXPAND_BUTTON_ATTRIBUTE = `[aria-label="Expand item"]`;

export const getDeleteButtons = (list: HTMLUListElement) => {
  return Array.from(list.querySelectorAll(DELETE_BUTTON_ATTRIBUTE));
};

export const getExpandButtons = (list: HTMLUListElement) => {
  return Array.from(list.querySelectorAll(EXPAND_BUTTON_ATTRIBUTE));
};
