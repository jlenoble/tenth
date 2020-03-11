export const localStorageId = "list-test";

export const defaultLocalStorageItems = [
  { id: "l1", text: "la", checked: true },
  { id: "l2", text: "lb", checked: false },
  { id: "l3", text: "lc", checked: true },
  { id: "l4", text: "ld", checked: false },
  { id: "l5", text: "le", checked: true }
];

const defaultItems = [
  { id: "1", text: "a", checked: true },
  { id: "2", text: "b", checked: false },
  { id: "3", text: "c", checked: true }
];

const propList = [{ defaultItems, localStorageId }, { localStorageId }];

export default propList;
