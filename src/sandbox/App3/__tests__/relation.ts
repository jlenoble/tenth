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

    rel2.remove(a.id, b.id);

    expect(Item.nItems).toStrictEqual(8);
    expect(Relationship.nItems).toStrictEqual(3);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(1);

    rel1.remove(a.id, b.id);

    expect(Item.nItems).toStrictEqual(7);
    expect(Relationship.nItems).toStrictEqual(2);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(1);
    expect(rel2.size).toStrictEqual(1);

    rel1.remove(a.id, c.id);

    expect(Item.nItems).toStrictEqual(7);
    expect(Relationship.nItems).toStrictEqual(2);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(1);
    expect(rel2.size).toStrictEqual(1);

    rel2.remove(a.id, c.id);

    expect(Item.nItems).toStrictEqual(6);
    expect(Relationship.nItems).toStrictEqual(1);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(1);
    expect(rel2.size).toStrictEqual(0);

    rel1.remove(b.id, c.id);

    expect(Item.nItems).toStrictEqual(5);
    expect(Relationship.nItems).toStrictEqual(0);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(0);
  });

  it("Testing relationships", () => {
    const rel = new Relation();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel.add(a, b);
    rel.add(a, c);
    rel.add(b, c);

    expect(rel.has(a.id, b.id)).toStrictEqual(true);
    expect(rel.has(a.id, c.id)).toStrictEqual(true);
    expect(rel.has(b.id, c.id)).toStrictEqual(true);

    rel.remove(a.id, b.id);

    expect(rel.has(a.id, b.id)).toStrictEqual(false);
    expect(rel.has(a.id, c.id)).toStrictEqual(true);
    expect(rel.has(b.id, c.id)).toStrictEqual(true);

    rel.remove(b.id, c.id);

    expect(rel.has(a.id, b.id)).toStrictEqual(false);
    expect(rel.has(a.id, c.id)).toStrictEqual(true);
    expect(rel.has(b.id, c.id)).toStrictEqual(false);
  });

  it("Testing relationships (destroying items)", () => {
    const rel = new Relation();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel.add(a, b);
    rel.add(a, c);
    rel.add(b, c);

    expect(rel.has(a.id, b.id)).toStrictEqual(true);
    expect(rel.has(a.id, c.id)).toStrictEqual(true);
    expect(rel.has(b.id, c.id)).toStrictEqual(true);

    a.destroy();

    expect(rel.has(a.id, b.id)).toStrictEqual(false);
    expect(rel.has(a.id, c.id)).toStrictEqual(false);
    expect(rel.has(b.id, c.id)).toStrictEqual(true);

    c.destroy();

    expect(rel.has(a.id, b.id)).toStrictEqual(false);
    expect(rel.has(a.id, c.id)).toStrictEqual(false);
    expect(rel.has(b.id, c.id)).toStrictEqual(false);
  });

  it("Getting relationships", () => {
    const rel = new Relation();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    const ra = rel.add(a, b);
    const rb = rel.add(a, c);
    const rc = rel.add(b, c);

    expect(rel.get(a.id, b.id)).toStrictEqual(ra);
    expect(rel.get(a.id, c.id)).toStrictEqual(rb);
    expect(rel.get(b.id, c.id)).toStrictEqual(rc);

    rel.remove(a.id, b.id);

    expect(rel.get(a.id, b.id)).toBeUndefined();
    expect(rel.get(a.id, c.id)).toStrictEqual(rb);
    expect(rel.get(b.id, c.id)).toStrictEqual(rc);

    b.destroy();

    expect(rel.get(a.id, b.id)).toBeUndefined();
    expect(rel.get(a.id, c.id)).toStrictEqual(rb);
    expect(rel.get(b.id, c.id)).toBeUndefined();
  });

  it("Looping on relationships", () => {
    const rel = new Relation();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    const ra = rel.add(a, b);
    const rb = rel.add(a, c);
    const rc = rel.add(b, c);

    expect(Array.from(rel.keys())).toEqual([ra.id, rb.id, rc.id]);
    expect(Array.from(rel.values())).toEqual([ra, rb, rc]);

    rb.destroy();

    expect(Array.from(rel.keys())).toEqual([ra.id, rc.id]);
    expect(Array.from(rel.values())).toEqual([ra, rc]);

    a.destroy();

    expect(Array.from(rel.keys())).toEqual([rc.id]);
    expect(Array.from(rel.values())).toEqual([rc]);
  });

  it("Looping on first item", () => {
    const rel = new Relation();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel.add(a, b);
    const rb = rel.add(a, c);
    rel.add(b, c);

    expect(Array.from(rel.firstKeys())).toEqual([a.id, a.id, b.id]);
    expect(Array.from(rel.firstValues())).toEqual([a, a, b]);

    rb.destroy();

    expect(Array.from(rel.firstKeys())).toEqual([a.id, b.id]);
    expect(Array.from(rel.firstValues())).toEqual([a, b]);

    a.destroy();

    expect(Array.from(rel.firstKeys())).toEqual([b.id]);
    expect(Array.from(rel.firstValues())).toEqual([b]);
  });
});
