import userEvents from "@testing-library/user-event";

export const fillWith = async (
  textbox: HTMLInputElement,
  addButton: HTMLButtonElement,
  items: string[]
) => {
  const l = items.length;

  for (let i = 0; i < l; i++) {
    await userEvents.type(textbox, items[i]);
    userEvents.click(addButton);
  }
};
