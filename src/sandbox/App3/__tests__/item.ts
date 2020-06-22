import { Item } from "../models";

describe("Items", () => {
  it("Creating/destroying items individually", () => {
    const a = new Item("a");
    expect(Item.nItems).toStrictEqual(1);

    const b = new Item("b");
    expect(Item.nItems).toStrictEqual(2);

    const c = new Item("c");
    expect(Item.nItems).toStrictEqual(3);

    a.destroy();
    expect(Item.nItems).toStrictEqual(2);

    b.destroy();
    expect(Item.nItems).toStrictEqual(1);

    c.destroy();
    expect(Item.nItems).toStrictEqual(0);
  });

  it("Creating/destroying items statically", () => {
    const a = Item.create("a");
    expect(Item.nItems).toStrictEqual(1);

    const b = Item.create("b");
    expect(Item.nItems).toStrictEqual(2);

    const c = Item.create("c");
    expect(Item.nItems).toStrictEqual(3);

    Item.destroy(a.id);
    expect(Item.nItems).toStrictEqual(2);

    Item.destroy(b.id);
    expect(Item.nItems).toStrictEqual(1);

    Item.destroy(c.id);
    expect(Item.nItems).toStrictEqual(0);
  });

  it("Testing items statically", () => {
    const a = Item.create("a");
    const b = Item.create("b");
    const c = Item.create("c");

    expect(Item.has(a.id)).toStrictEqual(true);
    expect(Item.has(b.id)).toStrictEqual(true);
    expect(Item.has(c.id)).toStrictEqual(true);

    Item.destroy(a.id);
    expect(Item.has(a.id)).toStrictEqual(false);
    expect(Item.has(b.id)).toStrictEqual(true);
    expect(Item.has(c.id)).toStrictEqual(true);

    b.destroy();
    expect(Item.has(a.id)).toStrictEqual(false);
    expect(Item.has(b.id)).toStrictEqual(false);
    expect(Item.has(c.id)).toStrictEqual(true);

    Item.destroy(c.id);
    expect(Item.has(a.id)).toStrictEqual(false);
    expect(Item.has(b.id)).toStrictEqual(false);
    expect(Item.has(c.id)).toStrictEqual(false);
  });

  it("Getting items statically", () => {
    const a = Item.create("a");
    const b = Item.create("b");
    const c = Item.create("c");

    expect(Item.get(a.id)).toStrictEqual(a);
    expect(Item.get(b.id)).toStrictEqual(b);
    expect(Item.get(c.id)).toStrictEqual(c);

    a.destroy();
    expect(Item.get(a.id)).toBeUndefined();
    expect(Item.get(b.id)).toStrictEqual(b);
    expect(Item.get(c.id)).toStrictEqual(c);

    Item.destroy(b.id);
    expect(Item.get(a.id)).toBeUndefined();
    expect(Item.get(b.id)).toBeUndefined();
    expect(Item.get(c.id)).toStrictEqual(c);

    c.destroy();
    expect(Item.get(a.id)).toBeUndefined();
    expect(Item.get(b.id)).toBeUndefined();
    expect(Item.get(c.id)).toBeUndefined();
  });
});
