const data: {
  items: { [key: string]: string };
  sets: { [key: string]: ReadonlyArray<string> };
  layout: ReadonlyArray<string>;
} = {
  items: {
    item1: "Hello",
    item2: "Hola",
    item3: "Hallo",
    item4: "Ciao",
    item5: "Bye",
    item6: "Tschüß"
  },
  sets: {
    set1: ["item1", "item2", "item3", "item4", "item5", "item6"],
    set2: [],
    set3: []
  },
  layout: ["set1", "set2", "set3"]
};

export default data;
