import { Item } from "..";

export const createItemFromText = (tmpId: () => string) => (
  text: string
): Item => {
  return {
    id: tmpId(),
    text,
    checked: false
  };
};

export const createItemsFromTexts = (tmpId: () => string) => {
  const createItem = createItemFromText(tmpId);
  return (texts: string[]): Item[] => texts.map(createItem);
};
