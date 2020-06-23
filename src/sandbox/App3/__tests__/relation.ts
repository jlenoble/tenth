import { Item, Relationship, Relation } from "../models";

describe("Relations", () => {
  afterEach(() => {
    Relation.clear();
    Item.clear();
  });

  it("Creating relations and adding relationships", () => {
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
  });
});
