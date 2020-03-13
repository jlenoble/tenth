export const localStorageId = "list-test";

export const defaultLocalStorageItems = [
  { id: "l1", text: "la", checked: true, edited: false },
  { id: "l2", text: "lb", checked: false, edited: false },
  { id: "l3", text: "lc", checked: true, edited: false },
  { id: "l4", text: "ld", checked: false, edited: false },
  { id: "l5", text: "le", checked: true, edited: false }
];

const defaultItems = [
  { id: "1", text: "a", checked: true, edited: false },
  { id: "2", text: "b", checked: false, edited: false },
  { id: "3", text: "c", checked: true, edited: false }
];

const propList = [{ defaultItems, localStorageId }, { localStorageId }];

export default propList;
