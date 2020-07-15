import { TestSuite } from "../../../testsuite";
import { BlockConstructor } from "../../block/types";

export const tests = <T>(
  Structure: BlockConstructor<T>,
  initArgs: T[]
): TestSuite => {
  const args = Array.from(new Set(initArgs));

  return {
    add(): void {
      it("Add items (enough capacity)", () => {
        const width = args.reduce((sum: number, arg: T) => sum + +arg, 0);
        const b = new Structure(width + 100);
        const _added: Set<T> = new Set();

        initArgs.forEach((arg) => {
          const { free, added } = b.add(arg, +arg);
          expect(added).toBe(!_added.has(arg));
          expect(free).toBeGreaterThan(0);
          _added.add(arg);
        });

        expect(b.width).toBe(width + 100);
        expect(b.occupied).toBe(width);
        expect(b.free).toBe(100);
        expect(b.size).toBe(args.length);
        expect(b.isEmpty()).toBe(false);
      });

      it("Add items (not enough capacity, boundary coincidence)", () => {
        const width = args.reduce((sum: number, arg: T) => sum + +arg, 0);
        const b = new Structure(width);
        const _added: Set<T> = new Set();

        initArgs.forEach((arg, i) => {
          const { free, added } = b.add(arg, +arg);
          expect(added).toBe(!_added.has(arg));

          if (i < initArgs.length - 1) {
            expect(free).toBeGreaterThan(0);
          } else {
            expect(free).toBe(0);
          }

          _added.add(arg);
        });

        initArgs.forEach((arg) => {
          const { free, added } = b.add(arg, +arg);
          expect(added).toBe(false);
          expect(free).toBe(0);
        });

        expect(b.width).toBe(width);
        expect(b.occupied).toBe(width);
        expect(b.free).toBe(0);
        expect(b.size).toBe(args.length);
        expect(b.isEmpty()).toBe(false);
      });

      it("Add items (not enough capacity, no boundary coincidence)", () => {
        const width = 10 * args.length;
        const b = new Structure(width);
        const _added: Set<T> = new Set();

        initArgs.forEach((arg, i) => {
          if (i < initArgs.length - 1) {
            const { free, added } = b.add(arg, 10);
            expect(added).toBe(!_added.has(arg));
            expect(free).toBeGreaterThan(0);
          } else {
            const { free, added } = b.add(arg, 15);
            expect(added).toBe(true);
            expect(free).toBe(-5);
          }

          _added.add(arg);
        });

        initArgs.forEach((arg) => {
          const { free, added } = b.add(arg, 10);
          expect(added).toBe(false);
          expect(free).toBe(0);
        });

        expect(b.width).toBe(width);
        expect(b.occupied).toBe(width);
        expect(b.free).toBe(0);
        expect(b.size).toBe(args.length);
        expect(b.isEmpty()).toBe(false);
      });
    },

    delete(): void {
      it("Delete items", () => {
        const width = args.reduce((sum: number, arg: T) => sum + +arg, 0);
        const b = new Structure(width + 100);
        const _deleted: Set<T> = new Set();

        initArgs.forEach((arg) => {
          b.add(arg, +arg);
        });

        let f = 100;

        initArgs.forEach((arg) => {
          const { free, deleted } = b.delete(arg);
          expect(deleted).toBe(!_deleted.has(arg));

          if (deleted) {
            f += +arg;
          }

          expect(free).toBe(f);
          _deleted.add(arg);
        });

        expect(b.width).toBe(width + 100);
        expect(b.occupied).toBe(0);
        expect(b.free).toBe(width + 100);
        expect(f).toBe(width + 100);
        expect(b.size).toBe(0);
        expect(b.isEmpty()).toBe(true);
      });
    },

    get(): void {
      it("Getting items", () => {
        const width = args.reduce((sum: number, arg: T) => sum + +arg, 0);
        const b = new Structure(width + 100);

        initArgs.forEach((arg) => {
          b.add(arg, +arg);
        });

        initArgs.forEach((arg) => {
          expect(b.get(arg)).toBe(+arg);
        });

        expect(b.width).toBe(width + 100);
        expect(b.occupied).toBe(width);
        expect(b.free).toBe(100);
        expect(b.size).toBe(args.length);
        expect(b.isEmpty()).toBe(false);
      });
    },

    has(): void {
      it("Testing items", () => {
        const width = args.reduce((sum: number, arg: T) => sum + +arg, 0);
        const b = new Structure(width + 100);

        initArgs.forEach((arg) => {
          b.add(arg, +arg);
        });

        initArgs.forEach((arg) => {
          expect(b.has(arg)).toBe(true);
        });

        expect(b.width).toBe(width + 100);
        expect(b.occupied).toBe(width);
        expect(b.free).toBe(100);
        expect(b.size).toBe(args.length);
        expect(b.isEmpty()).toBe(false);
      });
    },

    clear(): void {
      it("Clearing", () => {
        const width = args.reduce((sum: number, arg: T) => sum + +arg, 0);
        const b = new Structure(width + 100);

        initArgs.forEach((arg) => {
          b.add(arg, +arg);
        });

        expect(b.width).toBe(width + 100);
        expect(b.occupied).toBe(width);
        expect(b.free).toBe(100);
        expect(b.size).toBe(args.length);

        b.clear();

        expect(b.width).toBe(width + 100);
        expect(b.occupied).toBe(0);
        expect(b.free).toBe(width + 100);
        expect(b.size).toBe(0);
        expect(b.isEmpty()).toBe(true);
      });
    },

    width: false, // see addItems
    occupied: false, // see addItems
    free: false, // see addItems
    size: false, // see addItems
    isEmpty: false, // see addItems
  };
};
