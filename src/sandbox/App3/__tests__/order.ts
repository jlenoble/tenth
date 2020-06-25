import { Item, Relationship, Relation, Category, Order } from "../models";

describe("Orders", () => {
  afterEach(() => {
    Order.clear();
    Item.clear();
  });

  const init = () => {
    const cat = new Category("G");

    const ord1 = new Order(cat, ">");
    const ord2 = Order.create(cat, "<");

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();
    const d = Item.create();
    const e = Item.create();

    const b1 = cat.add(a);
    const b2 = cat.add(b);
    const b3 = cat.add(c);
    const b4 = cat.add(d);
    const b5 = cat.add(e);

    const gt1 = ord1.add(a, b);
    const gt2 = ord1.add(b, c);
    const gt3 = ord1.add(c, d);
    const gt4 = ord1.add(d, e);

    const lt1 = ord2.add(a, b);
    const lt2 = ord2.add(b, c);
    const lt3 = ord2.add(c, d);
    const lt4 = ord2.add(d, e);

    return {
      cat,

      ord1,
      ord2,

      a,
      b,
      c,
      d,
      e,

      b1,
      b2,
      b3,
      b4,
      b5,

      gt1,
      gt2,
      gt3,
      gt4,

      lt1,
      lt2,
      lt3,
      lt4,
    };
  };

  it("Creating/destroying orders", () => {
    const { ord1, ord2 } = init();

    expect(Item.nItems).toStrictEqual(21);
    expect(Relationship.nItems).toStrictEqual(13);
    expect(Relation.nItems).toStrictEqual(3);
    expect(Category.nItems).toStrictEqual(1);
    expect(Order.nItems).toStrictEqual(2);
    expect(ord1.size).toStrictEqual(4);
    expect(ord2.size).toStrictEqual(4);

    Order.destroy(ord1.id);

    expect(Item.nItems).toStrictEqual(16);
    expect(Relationship.nItems).toStrictEqual(9);
    expect(Relation.nItems).toStrictEqual(2);
    expect(Category.nItems).toStrictEqual(1);
    expect(Order.nItems).toStrictEqual(1);
    expect(ord1.size).toStrictEqual(0);
    expect(ord2.size).toStrictEqual(4);

    ord2.destroy();

    expect(Item.nItems).toStrictEqual(11);
    expect(Relationship.nItems).toStrictEqual(5);
    expect(Relation.nItems).toStrictEqual(1);
    expect(Category.nItems).toStrictEqual(1);
    expect(Order.nItems).toStrictEqual(0);
    expect(ord1.size).toStrictEqual(0);
    expect(ord2.size).toStrictEqual(0);
  });
});
