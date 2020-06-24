import { Item, Relationship, Relation } from "../models";

describe("Relations", () => {
  afterEach(() => {
    Relation.clear();
    Item.clear();
  });

  it("Creating/destroying relations individually", () => {
    const rel1 = new Relation();
    const rel2 = new Relation();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel1.add(a, b);
    rel2.add(a, c);
    rel1.add(b, c);

    expect(Item.nItems).toStrictEqual(8);
    expect(Relationship.nItems).toStrictEqual(3);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(1);

    rel1.destroy();

    expect(Item.nItems).toStrictEqual(5);
    expect(Relationship.nItems).toStrictEqual(1);
    expect(Relation.nItems).toStrictEqual(1);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(1);

    rel2.destroy();

    expect(Item.nItems).toStrictEqual(3);
    expect(Relationship.nItems).toStrictEqual(0);
    expect(Relation.nItems).toStrictEqual(0);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(0);
  });

  it("Creating/destroying relations statically", () => {
    const rel1 = Relation.create();
    const rel2 = Relation.create();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel1.add(a, b);
    rel2.add(a, c);
    rel1.add(b, c);

    expect(Item.nItems).toStrictEqual(8);
    expect(Relationship.nItems).toStrictEqual(3);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(1);

    Relation.destroy(rel1.id);

    expect(Item.nItems).toStrictEqual(5);
    expect(Relationship.nItems).toStrictEqual(1);
    expect(Relation.nItems).toStrictEqual(1);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(1);

    Item.destroy(rel2.id);

    expect(Item.nItems).toStrictEqual(3);
    expect(Relationship.nItems).toStrictEqual(0);
    expect(Relation.nItems).toStrictEqual(0);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(0);
  });

  it("Removing relationships", () => {
    const rel1 = new Relation();
    const rel2 = new Relation();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel1.add(a, b);
    rel2.add(a, c);
    rel1.add(b, c);

    expect(Item.nItems).toStrictEqual(8);
    expect(Relationship.nItems).toStrictEqual(3);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(1);

    rel2.remove(a, b);

    expect(Item.nItems).toStrictEqual(8);
    expect(Relationship.nItems).toStrictEqual(3);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(1);

    rel1.remove(a, b);

    expect(Item.nItems).toStrictEqual(7);
    expect(Relationship.nItems).toStrictEqual(2);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(1);
    expect(rel2.size).toStrictEqual(1);

    rel1.remove(a, c);

    expect(Item.nItems).toStrictEqual(7);
    expect(Relationship.nItems).toStrictEqual(2);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(1);
    expect(rel2.size).toStrictEqual(1);

    rel2.remove(a, c);

    expect(Item.nItems).toStrictEqual(6);
    expect(Relationship.nItems).toStrictEqual(1);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(1);
    expect(rel2.size).toStrictEqual(0);

    rel1.remove(b, c);

    expect(Item.nItems).toStrictEqual(5);
    expect(Relationship.nItems).toStrictEqual(0);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(0);
  });
});
