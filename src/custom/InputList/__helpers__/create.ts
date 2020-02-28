import { Item, defaultTmpId } from "..";

export const createItemFromText = (tmpId: () => string = defaultTmpId) => (
  text: string
): Item => {
  return {
    id: tmpId(),
    text,
    checked: false
  };
};

export const createItemsFromTexts = (tmpId: () => string = defaultTmpId) => {
  const createItem = createItemFromText(tmpId);
  return (texts: string[]): Item[] => texts.map(createItem);
};
