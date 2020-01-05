const data: {
  items: { [key: string]: string };
  categories: { [key: string]: ReadonlyArray<string> };
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
  categories: {
    category1: ["item1", "item2", "item3", "item4", "item5", "item6"],
    category2: [],
    category3: []
  },
  layout: ["category2", "category3", "category1"]
};

export default data;
