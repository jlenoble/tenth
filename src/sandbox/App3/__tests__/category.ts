import { Item, Relationship, Relation, Category } from "../models";

describe("Categories", () => {
  afterEach(() => {
    Category.clear();
    Item.clear();
  });

  it("Creating/destroying categories individually", () => {
    const rel1 = new Category("foo");
    const rel2 = new Category("bar");

    const a = Item.create();
    const b = Item.create();

    rel1.add(a);
    rel2.add(a);
    rel1.add(b);
    rel1.add(b);

    expect(Item.nItems).toStrictEqual(7);
    expect(Relationship.nItems).toStrictEqual(3);
    expect(Relation.nItems).toStrictEqual(2);
    expect(Category.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(1);

    rel1.destroy();

    expect(Item.nItems).toStrictEqual(4);
    expect(Relationship.nItems).toStrictEqual(1);
    expect(Relation.nItems).toStrictEqual(1);
    expect(Category.nItems).toStrictEqual(1);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(1);

    rel2.destroy();

    expect(Item.nItems).toStrictEqual(2);
    expect(Relationship.nItems).toStrictEqual(0);
    expect(Relation.nItems).toStrictEqual(0);
    expect(Category.nItems).toStrictEqual(0);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(0);
  });

  it("Creating/destroying categories statically", () => {
    const rel1 = Category.create("foo");
    const rel2 = Category.create("bar");

    const a = Item.create();
    const b = Item.create();

    rel1.add(a);
    rel1.add(a);
    rel2.add(a);
    rel1.add(b);

    expect(Item.nItems).toStrictEqual(7);
    expect(Relationship.nItems).toStrictEqual(3);
    expect(Relation.nItems).toStrictEqual(2);
    expect(Category.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(1);

    Relation.destroy(rel1.id);

    expect(Item.nItems).toStrictEqual(4);
    expect(Relationship.nItems).toStrictEqual(1);
    expect(Relation.nItems).toStrictEqual(1);
    expect(Category.nItems).toStrictEqual(1);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(1);

    Item.destroy(rel2.id);

    expect(Item.nItems).toStrictEqual(2);
    expect(Relationship.nItems).toStrictEqual(0);
    expect(Relation.nItems).toStrictEqual(0);
    expect(Category.nItems).toStrictEqual(0);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(0);
  });

  it("Removing items", () => {
    const rel1 = new Category("foo");
    const rel2 = new Category("bar");

    const a = Item.create();
    const b = Item.create();

    rel1.add(a);
    rel1.add(a);
    rel2.add(a);
    rel1.add(b);

    expect(Item.nItems).toStrictEqual(7);
    expect(Relationship.nItems).toStrictEqual(3);
    expect(Relation.nItems).toStrictEqual(2);
    expect(Category.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(1);

    rel2.remove(a.id);

    expect(Item.nItems).toStrictEqual(6);
    expect(Relationship.nItems).toStrictEqual(2);
    expect(Relation.nItems).toStrictEqual(2);
    expect(Category.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(2);
    expect(rel2.size).toStrictEqual(0);

    rel1.remove(a.id);

    expect(Item.nItems).toStrictEqual(5);
    expect(Relationship.nItems).toStrictEqual(1);
    expect(Relation.nItems).toStrictEqual(2);
    expect(Category.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(1);
    expect(rel2.size).toStrictEqual(0);

    rel1.remove(a.id);

    expect(Item.nItems).toStrictEqual(5);
    expect(Relationship.nItems).toStrictEqual(1);
    expect(Relation.nItems).toStrictEqual(2);
    expect(Category.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(1);
    expect(rel2.size).toStrictEqual(0);

    rel1.remove(b.id);

    expect(Item.nItems).toStrictEqual(4);
    expect(Relationship.nItems).toStrictEqual(0);
    expect(Relation.nItems).toStrictEqual(2);
    expect(Category.nItems).toStrictEqual(2);
    expect(rel1.size).toStrictEqual(0);
    expect(rel2.size).toStrictEqual(0);
  });

  it("Testing items", () => {
    const rel = new Category("foo");

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel.add(a);
    rel.add(a);
    rel.add(c);

    expect(rel.has(a.id)).toStrictEqual(true);
    expect(rel.has(b.id)).toStrictEqual(false);
    expect(rel.has(c.id)).toStrictEqual(true);

    rel.remove(a.id);

    expect(rel.has(a.id)).toStrictEqual(false);
    expect(rel.has(b.id)).toStrictEqual(false);
    expect(rel.has(c.id)).toStrictEqual(true);

    expect(rel.size).toStrictEqual(1);

    rel.remove(b.id);

    expect(rel.has(a.id)).toStrictEqual(false);
    expect(rel.has(b.id)).toStrictEqual(false);
    expect(rel.has(c.id)).toStrictEqual(true);

    rel.remove(c.id);

    expect(rel.has(a.id)).toStrictEqual(false);
    expect(rel.has(a.id)).toStrictEqual(false);
    expect(rel.has(b.id)).toStrictEqual(false);
  });

  it("Testing items (destroying items)", () => {
    const rel = new Category("foo");

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel.add(a);
    rel.add(b);
    rel.add(c);

    expect(rel.has(a.id)).toStrictEqual(true);
    expect(rel.has(b.id)).toStrictEqual(true);
    expect(rel.has(c.id)).toStrictEqual(true);

    expect(rel.size).toStrictEqual(3);

    a.destroy();

    expect(rel.has(a.id)).toStrictEqual(false);
    expect(rel.has(b.id)).toStrictEqual(true);
    expect(rel.has(c.id)).toStrictEqual(true);

    expect(rel.size).toStrictEqual(2);

    c.destroy();

    expect(rel.has(a.id)).toStrictEqual(false);
    expect(rel.has(b.id)).toStrictEqual(true);
    expect(rel.has(c.id)).toStrictEqual(false);

    expect(rel.size).toStrictEqual(1);
  });

  // it("Getting items", () => {
  //   const rel = new Category("foo");

  //   const a = Item.create();
  //   const b = Item.create();
  //   const c = Item.create();

  //   const ra = rel.add(a);
  //   const rb = rel.add(b);
  //   const rc = rel.add(c);

  //   expect(rel.getRelationship(a.id)).toStrictEqual(ra);
  //   expect(rel.getRelationship(b.id)).toStrictEqual(rb);
  //   expect(rel.getRelationship(c.id)).toStrictEqual(rc);

  //   expect(rel.get(a.id)).toStrictEqual(a);
  //   expect(rel.get(b.id)).toStrictEqual(b);
  //   expect(rel.get(c.id)).toStrictEqual(c);

  //   expect(rel.size).toStrictEqual(3);

  //   rel.remove(a.id);

  //   expect(rel.getRelationship(a.id)).toBeUndefined();
  //   expect(rel.getRelationship(b.id)).toStrictEqual(rb);
  //   expect(rel.getRelationship(c.id)).toStrictEqual(rc);

  //   expect(rel.get(a.id)).toBeUndefined();
  //   expect(rel.get(b.id)).toStrictEqual(b);
  //   expect(rel.get(c.id)).toStrictEqual(c);

  //   expect(rel.size).toStrictEqual(2);

  //   b.destroy();

  //   expect(rel.getRelationship(a.id)).toBeUndefined();
  //   expect(rel.getRelationship(b.id)).toBeUndefined();
  //   expect(rel.getRelationship(c.id)).toStrictEqual(rc);

  //   expect(rel.get(a.id)).toBeUndefined();
  //   expect(rel.get(b.id)).toBeUndefined();
  //   expect(rel.get(c.id)).toStrictEqual(c);

  //   expect(rel.size).toStrictEqual(1);
  // });

  it("Looping on items", () => {
    const rel = new Category("foo");

    const a = Item.create();
    const b = Item.create();
    const c = Item.create();

    rel.add(a);
    const rb = rel.add(b);
    rel.add(c);

    expect(Array.from(rel.itemKeys())).toEqual([a.id, b.id, c.id]);
    expect(Array.from(rel.itemValues())).toEqual([a, b, c]);

    rb.destroy();

    expect(Array.from(rel.itemKeys())).toEqual([a.id, c.id]);
    expect(Array.from(rel.itemValues())).toEqual([a, c]);

    a.destroy();

    expect(Array.from(rel.itemKeys())).toEqual([c.id]);
    expect(Array.from(rel.itemValues())).toEqual([c]);

    expect(rel.size).toStrictEqual(1);
  });

  // it("Accessing item boundaries", () => {
  //   const rel = new Category("foo");

  //   const a = Item.create();
  //   const b = Item.create();
  //   const c = Item.create();

  //   const ra = rel.add(a);
  //   const rb = rel.add(b);
  //   const rc = rel.add(c);

  //   expect(rel.firstId).toStrictEqual(ra.id);
  //   expect(rel.lastId).toStrictEqual(rc.id);

  //   expect(rel.first).toStrictEqual(ra);
  //   expect(rel.last).toStrictEqual(rc);

  //   rb.destroy();

  //   expect(rel.firstId).toStrictEqual(ra.id);
  //   expect(rel.lastId).toStrictEqual(rc.id);

  //   expect(rel.first).toStrictEqual(ra);
  //   expect(rel.last).toStrictEqual(rc);

  //   ra.destroy();

  //   expect(rel.firstId).toStrictEqual(rc.id);
  //   expect(rel.lastId).toStrictEqual(rc.id);

  //   expect(rel.first).toStrictEqual(rc);
  //   expect(rel.last).toStrictEqual(rc);

  //   rc.destroy();

  //   expect(rel.firstId).toStrictEqual(-1);
  //   expect(rel.lastId).toStrictEqual(-1);

  //   expect(rel.first).toBeUndefined();
  //   expect(rel.last).toBeUndefined();

  //   expect(rel.size).toStrictEqual(0);
  // });
});
