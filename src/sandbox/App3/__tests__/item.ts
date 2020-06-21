import { Item } from "../models";

describe("Items", () => {
  it("Creating/destroying items individually", () => {
    const a = new Item("a");
    const b = new Item("b");
    const c = new Item("c");

    expect(Item.nItems).toStrictEqual(3);

    a.destroy();
    b.destroy();
    c.destroy();

    expect(Item.nItems).toStrictEqual(0);
  });
});
