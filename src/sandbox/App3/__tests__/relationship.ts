import { Item, Relationship } from "../models";

describe("Relationships", () => {
  afterEach(() => {
    Relationship.clear();
    Item.clear();
  });

  it("Creating/destroying a relationship individually", () => {
    const a = new Item();
    const r = new Item();
    const b = new Item();

    const rel = new Relationship(a.id, r.id, b.id);

    expect(Item.nItems).toStrictEqual(4);
    expect(Relationship.nItems).toStrictEqual(1);

    rel.destroy();

    expect(Item.nItems).toStrictEqual(3);
    expect(Relationship.nItems).toStrictEqual(0);
  });

  it("Creating/destroying a relationship statically", () => {
    const a = new Item();
    const r = new Item();
    const b = new Item();

    const rel = Relationship.create(a.id, r.id, b.id);

    expect(Item.nItems).toStrictEqual(4);
    expect(Relationship.nItems).toStrictEqual(1);

    Relationship.destroy(rel.id);

    expect(Item.nItems).toStrictEqual(3);
    expect(Relationship.nItems).toStrictEqual(0);
  });

  it("Clearing a relationship statically", () => {
    const a = new Item();
    const r = new Item();
    const b = new Item();

    Relationship.create(a.id, r.id, a.id);
    Relationship.create(a.id, r.id, b.id);
    Relationship.create(b.id, r.id, a.id);
    Relationship.create(b.id, r.id, b.id);

    expect(Item.nItems).toStrictEqual(7);
    expect(Relationship.nItems).toStrictEqual(4);

    Relationship.clear();

    expect(Item.nItems).toStrictEqual(3);
    expect(Relationship.nItems).toStrictEqual(0);

    Relationship.create(a.id, r.id, a.id);
    Relationship.create(a.id, r.id, b.id);
    Relationship.create(b.id, r.id, a.id);
    Relationship.create(b.id, r.id, b.id);

    expect(Item.nItems).toStrictEqual(7);
    expect(Relationship.nItems).toStrictEqual(4);

    Item.clear();

    expect(Item.nItems).toStrictEqual(0);
    expect(Relationship.nItems).toStrictEqual(0);
  });

  it("Testing relationships statically", () => {
    const a = Item.create();
    const r = Item.create();
    const b = Item.create();

    const rel1 = Relationship.create(a.id, r.id, a.id);
    const rel2 = Relationship.create(a.id, r.id, b.id);
    const rel3 = Relationship.create(b.id, r.id, a.id);

    expect(Item.has(rel1.id)).toStrictEqual(true);
    expect(Item.has(rel2.id)).toStrictEqual(true);
    expect(Item.has(rel3.id)).toStrictEqual(true);

    expect(Relationship.has(rel1.id)).toStrictEqual(true);
    expect(Relationship.has(rel2.id)).toStrictEqual(true);
    expect(Relationship.has(rel3.id)).toStrictEqual(true);

    rel1.destroy();

    expect(Item.has(rel1.id)).toStrictEqual(false);
    expect(Item.has(rel2.id)).toStrictEqual(true);
    expect(Item.has(rel3.id)).toStrictEqual(true);

    expect(Relationship.has(rel1.id)).toStrictEqual(false);
    expect(Relationship.has(rel2.id)).toStrictEqual(true);
    expect(Relationship.has(rel3.id)).toStrictEqual(true);

    Relationship.destroy(rel2.id);

    expect(Item.has(rel1.id)).toStrictEqual(false);
    expect(Item.has(rel2.id)).toStrictEqual(false);
    expect(Item.has(rel3.id)).toStrictEqual(true);

    expect(Relationship.has(rel1.id)).toStrictEqual(false);
    expect(Relationship.has(rel2.id)).toStrictEqual(false);
    expect(Relationship.has(rel3.id)).toStrictEqual(true);

    Item.destroy(rel3.id);

    expect(Item.has(rel1.id)).toStrictEqual(false);
    expect(Item.has(rel2.id)).toStrictEqual(false);
    expect(Item.has(rel3.id)).toStrictEqual(false);

    expect(Relationship.has(rel1.id)).toStrictEqual(false);
    expect(Relationship.has(rel2.id)).toStrictEqual(false);
    expect(Relationship.has(rel3.id)).toStrictEqual(false);
  });

  it("Getting relationships statically", () => {
    const a = Item.create();
    const r = Item.create();
    const b = Item.create();

    const rel1 = Relationship.create(a.id, r.id, a.id);
    const rel2 = Relationship.create(a.id, r.id, b.id);
    const rel3 = Relationship.create(b.id, r.id, a.id);

    expect(Item.get(rel1.id)).toStrictEqual(rel1);
    expect(Item.get(rel2.id)).toStrictEqual(rel2);
    expect(Item.get(rel3.id)).toStrictEqual(rel3);

    expect(Relationship.get(rel1.id)).toStrictEqual(rel1);
    expect(Relationship.get(rel2.id)).toStrictEqual(rel2);
    expect(Relationship.get(rel3.id)).toStrictEqual(rel3);

    rel1.destroy();

    expect(Item.get(rel1.id)).toBeUndefined();
    expect(Item.get(rel2.id)).toStrictEqual(rel2);
    expect(Item.get(rel3.id)).toStrictEqual(rel3);

    expect(Relationship.get(rel1.id)).toBeUndefined();
    expect(Relationship.get(rel2.id)).toStrictEqual(rel2);
    expect(Relationship.get(rel3.id)).toStrictEqual(rel3);

    Relationship.destroy(rel2.id);

    expect(Item.get(rel1.id)).toBeUndefined();
    expect(Item.get(rel2.id)).toBeUndefined();
    expect(Item.get(rel3.id)).toStrictEqual(rel3);

    expect(Relationship.get(rel1.id)).toBeUndefined();
    expect(Relationship.get(rel2.id)).toBeUndefined();
    expect(Relationship.get(rel3.id)).toStrictEqual(rel3);

    Item.destroy(rel3.id);

    expect(Item.get(rel1.id)).toBeUndefined();
    expect(Item.get(rel2.id)).toBeUndefined();
    expect(Item.get(rel3.id)).toBeUndefined();

    expect(Relationship.get(rel1.id)).toBeUndefined();
    expect(Relationship.get(rel2.id)).toBeUndefined();
    expect(Relationship.get(rel3.id)).toBeUndefined();
  });

  it("Getting related items and relation", () => {
    const a = Item.create();
    const r = Item.create();
    const b = Item.create();

    const rel = Relationship.create(a.id, r.id, b.id);

    expect(rel.relationId).toStrictEqual(r.id);
    expect(rel.relation).toStrictEqual(r);

    expect(rel.firstId).toStrictEqual(a.id);
    expect(rel.lastId).toStrictEqual(b.id);
    expect(rel.first).toStrictEqual(a);
    expect(rel.last).toStrictEqual(b);

    rel.destroy();

    expect(rel.relationId).toStrictEqual(r.id);
    expect(rel.relation).toStrictEqual(r);

    expect(rel.firstId).toStrictEqual(a.id);
    expect(rel.lastId).toStrictEqual(b.id);
    expect(rel.first).toStrictEqual(a);
    expect(rel.last).toStrictEqual(b);

    a.destroy();

    expect(rel.relationId).toStrictEqual(r.id);
    expect(rel.relation).toStrictEqual(r);

    expect(rel.firstId).toStrictEqual(-1);
    expect(rel.lastId).toStrictEqual(b.id);
    expect(rel.first).toStrictEqual(null);
    expect(rel.last).toStrictEqual(b);

    b.destroy();

    expect(rel.relationId).toStrictEqual(r.id);
    expect(rel.relation).toStrictEqual(r);

    expect(rel.firstId).toStrictEqual(-1);
    expect(rel.lastId).toStrictEqual(-1);
    expect(rel.first).toStrictEqual(null);
    expect(rel.last).toStrictEqual(null);

    r.destroy();

    expect(rel.relationId).toStrictEqual(-1);
    expect(rel.relation).toStrictEqual(null);

    expect(rel.firstId).toStrictEqual(-1);
    expect(rel.lastId).toStrictEqual(-1);
    expect(rel.first).toStrictEqual(null);
    expect(rel.last).toStrictEqual(null);
  });

  it("Disabling a relationship on item destroy", () => {
    const a = Item.create();
    const r = Item.create();
    const b = Item.create();

    const rel = Relationship.create(a.id, r.id, b.id);

    expect(Item.get(a.id)).toStrictEqual(a);
    expect(Item.get(b.id)).toStrictEqual(b);
    expect(Item.get(r.id)).toStrictEqual(r);
    expect(Item.get(rel.id)).toStrictEqual(rel);
    expect(Relationship.get(rel.id)).toStrictEqual(rel);

    a.destroy();

    expect(Item.get(a.id)).toBeUndefined();
    expect(Item.get(b.id)).toStrictEqual(b);
    expect(Item.get(r.id)).toStrictEqual(r);
    expect(Item.get(rel.id)).toStrictEqual(rel);
    expect(Relationship.get(rel.id)).toStrictEqual(rel);

    expect(rel.last).toStrictEqual(b);
    expect(rel.relation).toStrictEqual(r);

    expect(Item.get(a.id)).toBeUndefined();
    expect(Item.get(b.id)).toStrictEqual(b);
    expect(Item.get(r.id)).toStrictEqual(r);
    expect(Item.get(rel.id)).toStrictEqual(rel);
    expect(Relationship.get(rel.id)).toStrictEqual(rel);

    expect(rel.first).toBeNull();

    expect(Item.get(a.id)).toBeUndefined();
    expect(Item.get(b.id)).toStrictEqual(b);
    expect(Item.get(r.id)).toStrictEqual(r);
    expect(Item.get(rel.id)).toBeUndefined();
    expect(Relationship.get(rel.id)).toBeUndefined();
  });
});
