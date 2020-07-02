import { makeTestSuite } from "../../testsuite";
import { Comparator, defaultCompare } from "../comparator";

type Obj = { value: number };
const compare = (a: Obj, b: Obj) =>
  a.value === b.value ? 0 : a.value < b.value ? -1 : 1;

makeTestSuite(
  Comparator,
  {
    compare({ it }) {
      it(() => {
        const c = new Comparator<number>();
        expect(c.compare).toBe(defaultCompare);
        const d = new Comparator<Obj>(compare);
        expect(d.compare).toBe(compare);
      });
    },
    resetCompare({ it }) {
      it(() => {
        const c = new Comparator<number>();
        expect(c.compare).toBe(defaultCompare);

        const compare = (a: number, b: number) => {
          return a === b ? 0 : a > b ? -1 : 1;
        };

        c.resetCompare(compare);
        expect(c.compare).toBe(compare);
      });
    },
    equal({ it }) {
      it(() => {
        const c = new Comparator<number>();
        expect(c.equal(0, 10)).toBe(false);
        expect(c.equal(10, 10)).toBe(true);
        expect(c.equal(10, 0)).toBe(false);

        const o1 = { value: 5 };
        const o2 = { value: 0 };

        const d = new Comparator<Obj>(compare);
        expect(d.equal(o1, o2)).toBe(false);
        expect(d.equal(o1, o1)).toBe(true);
        expect(d.equal(o2, o1)).toBe(false);
      });
    },
    lessThan({ it }) {
      it(() => {
        const c = new Comparator<number>();
        expect(c.lessThan(0, 10)).toBe(true);
        expect(c.lessThan(10, 10)).toBe(false);
        expect(c.lessThan(10, 0)).toBe(false);

        const o1 = { value: -12 };
        const o2 = { value: 5 };

        const d = new Comparator<Obj>(compare);
        expect(d.lessThan(o1, o2)).toBe(true);
        expect(d.lessThan(o1, o1)).toBe(false);
        expect(d.lessThan(o2, o1)).toBe(false);
      });
    },
    greaterThan({ it }) {
      it(() => {
        const c = new Comparator<number>();
        expect(c.greaterThan(0, 10)).toBe(false);
        expect(c.greaterThan(10, 10)).toBe(false);
        expect(c.greaterThan(10, 0)).toBe(true);

        const o1 = { value: -12 };
        const o2 = { value: 5 };

        const d = new Comparator<Obj>(compare);
        expect(d.greaterThan(o1, o2)).toBe(false);
        expect(d.greaterThan(o1, o1)).toBe(false);
        expect(d.greaterThan(o2, o1)).toBe(true);
      });
    },
    lessThanOrEqual({ it }) {
      it(() => {
        const c = new Comparator<number>();
        expect(c.lessThanOrEqual(0, 10)).toBe(true);
        expect(c.lessThanOrEqual(10, 10)).toBe(true);
        expect(c.lessThanOrEqual(10, 0)).toBe(false);

        const o1 = { value: -12 };
        const o2 = { value: 5 };

        const d = new Comparator<Obj>(compare);
        expect(d.lessThanOrEqual(o1, o2)).toBe(true);
        expect(d.lessThanOrEqual(o1, o1)).toBe(true);
        expect(d.lessThanOrEqual(o2, o1)).toBe(false);
      });
    },
    greaterThanOrEqual({ it }) {
      it(() => {
        const c = new Comparator<number>();
        expect(c.greaterThanOrEqual(0, 10)).toBe(false);
        expect(c.greaterThanOrEqual(10, 10)).toBe(true);
        expect(c.greaterThanOrEqual(10, 0)).toBe(true);

        const o1 = { value: -12 };
        const o2 = { value: 5 };

        const d = new Comparator<Obj>(compare);
        expect(d.greaterThanOrEqual(o1, o2)).toBe(false);
        expect(d.greaterThanOrEqual(o1, o1)).toBe(true);
        expect(d.greaterThanOrEqual(o2, o1)).toBe(true);
      });
    },
  },
  {
    length({ it }) {
      it(() => {
        expect(Comparator.length).toBe(0);
      });
    },
    name({ it }) {
      it(() => {
        expect(Comparator.name).toBe("Comparator");
      });
    },
  }
);
