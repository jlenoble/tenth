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

    const r1 = rel1.add(a, b);
    const r2 = rel2.add(a, c);
    const r3 = rel1.add(b, c);

    expect(Item.nItems).toStrictEqual(8);
    expect(Relationship.nItems).toStrictEqual(3);
    expect(Relation.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(1);

    Relation.destroy(a.id);
    Relation.destroy(b.id);
    Relation.destroy(c.id);
    Relation.destroy(r1.id);
    Relation.destroy(r2.id);
    Relation.destroy(r3.id);

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

    expect(Item.has(a.id)).toStrictEqual(true);
    expect(Item.has(b.id)).toStrictEqual(true);
    expect(Item.has(c.id)).toStrictEqual(true);

    expect(Relation.has(a.id)).toStrictEqual(false);
    expect(Relation.has(b.id)).toStrictEqual(false);
    expect(Relation.has(c.id)).toStrictEqual(false);

    const r1 = rel.add(a, b);
    const r2 = rel.add(a, c);
    const r3 = rel.add(b, c);

    expect(Item.has(r1.id)).toStrictEqual(true);
    expect(Item.has(r2.id)).toStrictEqual(true);
    expect(Item.has(r3.id)).toStrictEqual(true);

    expect(Relation.has(r1.id)).toStrictEqual(false);
    expect(Relation.has(r2.id)).toStrictEqual(false);
    expect(Relation.has(r3.id)).toStrictEqual(false);

    expect(rel.has(a.id, b.id)).toStrictEqual(true);
    expect(rel.has(a.id, c.id)).toStrictEqual(true);
    expect(rel.has(b.id, c.id)).toStrictEqual(true);

    rel.remove(a.id, b.id);

    expect(rel.has(a.id, b.id)).toStrictEqual(false);
    expect(rel.has(a.id, c.id)).toStrictEqual(true);
    expect(rel.has(b.id, c.id)).toStrictEqual(true);

    expect(rel.size).toStrictEqual(2);

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

    expect(rel.size).toStrictEqual(3);

    a.destroy();

    expect(rel.has(a.id, b.id)).toStrictEqual(false);
    expect(rel.has(a.id, c.id)).toStrictEqual(false);
    expect(rel.has(b.id, c.id)).toStrictEqual(true);

    expect(rel.size).toStrictEqual(1);

    c.destroy();

    expect(rel.has(a.id, b.id)).toStrictEqual(false);
    expect(rel.has(a.id, c.id)).toStrictEqual(false);
    expect(rel.has(b.id, c.id)).toStrictEqual(false);

    expect(rel.size).toStrictEqual(0);
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

    expect(rel.size).toStrictEqual(3);

    rel.remove(a.id, b.id);

    expect(rel.get(a.id, b.id)).toBeUndefined();
    expect(rel.get(a.id, c.id)).toStrictEqual(rb);
    expect(rel.get(b.id, c.id)).toStrictEqual(rc);

    expect(rel.size).toStrictEqual(2);

    b.destroy();

    expect(rel.get(a.id, b.id)).toBeUndefined();
    expect(rel.get(a.id, c.id)).toStrictEqual(rb);
    expect(rel.get(b.id, c.id)).toBeUndefined();

    expect(rel.size).toStrictEqual(1);
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

    expect(rel.size).toStrictEqual(2);

    a.destroy();

    expect(rel.size).toStrictEqual(1);

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

    expect(rel.size).toStrictEqual(1);
  });

  it("Looping on last item", () => {
    const rel = new Relation();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel.add(a, b);
    const rb = rel.add(a, c);
    rel.add(b, c);

    expect(Array.from(rel.lastKeys())).toEqual([b.id, c.id, c.id]);
    expect(Array.from(rel.lastValues())).toEqual([b, c, c]);

    rb.destroy();

    expect(Array.from(rel.lastKeys())).toEqual([b.id, c.id]);
    expect(Array.from(rel.lastValues())).toEqual([b, c]);

    a.destroy();

    expect(rel.size).toStrictEqual(1);

    expect(Array.from(rel.lastKeys())).toEqual([c.id]);
    expect(Array.from(rel.lastValues())).toEqual([c]);
  });

  it("Accessing boundaries", () => {
    const rel = new Relation();

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    const ra = rel.add(a, b);
    const rb = rel.add(a, c);
    const rc = rel.add(b, c);

    expect(rel.firstId).toStrictEqual(ra.id);
    expect(rel.lastId).toStrictEqual(rc.id);

    expect(rel.first).toStrictEqual(ra);
    expect(rel.last).toStrictEqual(rc);

    rb.destroy();

    expect(rel.firstId).toStrictEqual(ra.id);
    expect(rel.lastId).toStrictEqual(rc.id);

    expect(rel.first).toStrictEqual(ra);
    expect(rel.last).toStrictEqual(rc);

    ra.destroy();

    expect(rel.firstId).toStrictEqual(rc.id);
    expect(rel.lastId).toStrictEqual(rc.id);

    expect(rel.first).toStrictEqual(rc);
    expect(rel.last).toStrictEqual(rc);

    rc.destroy();

    expect(rel.firstId).toStrictEqual(-1);
    expect(rel.lastId).toStrictEqual(-1);

    expect(rel.first).toBeUndefined();
    expect(rel.last).toBeUndefined();

    expect(rel.size).toStrictEqual(0);
  });
});
