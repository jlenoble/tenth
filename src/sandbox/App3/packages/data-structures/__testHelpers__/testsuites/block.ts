import { TestSuite } from "../../../testsuite";
import { BlockConstructor } from "../../block/types";

export const tests = <T>(
  Structure: BlockConstructor<T>,
  initArgs: T[],
  getWidth = (arg: T) => +arg,
  blockWidth = -1
): TestSuite => {
  const args = Array.from(new Set(initArgs));

  return {
    add(): void {
      it("Add items (enough capacity)", () => {
        const width = args.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(blockWidth === -1 ? width + 100 : blockWidth);
        const _added: Set<T> = new Set();

        initArgs.forEach((arg) => {
          const { free, added } = b.add(arg, getWidth(arg));
          expect(added).toBe(!_added.has(arg));
          expect(free).toBeGreaterThan(0);
          _added.add(arg);
        });

        expect(b.width).toBe(width + 100);
        expect(b.occupied).toBe(width);
        expect(b.free).toBe(100);
        expect(b.size).toBe(args.length);
        expect(b.isEmpty()).toBe(false);
        expect(b.isFull()).toBe(false);
      });

      it("Add items (not enough capacity, boundary coincidence)", () => {
        const width = args.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(width);
        const _added: Set<T> = new Set();

        initArgs.forEach((arg, i) => {
          const { free, added } = b.add(arg, getWidth(arg));
          expect(added).toBe(!_added.has(arg));

          if (i < initArgs.length - 1) {
            expect(free).toBeGreaterThan(0);
          } else {
            expect(free).toBe(0);
          }

          _added.add(arg);
        });

        initArgs.forEach((arg) => {
          const { free, added } = b.add(arg, getWidth(arg));
          expect(added).toBe(false);
          expect(free).toBe(0);
        });

        expect(b.width).toBe(width);
        expect(b.occupied).toBe(width);
        expect(b.free).toBe(0);
        expect(b.size).toBe(args.length);
        expect(b.isEmpty()).toBe(false);
        expect(b.isFull()).toBe(true);
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
        expect(b.isFull()).toBe(true);
      });
    },

    delete(): void {
      it("Delete items", () => {
        const width = args.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(blockWidth === -1 ? width + 100 : blockWidth);
        const _deleted: Set<T> = new Set();

        initArgs.forEach((arg) => {
          b.add(arg, getWidth(arg));
        });

        let f = 100;

        initArgs.forEach((arg) => {
          const { free, deleted } = b.delete(arg);
          expect(deleted).toBe(!_deleted.has(arg));

          if (deleted) {
            f += getWidth(arg);
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
        expect(b.isFull()).toBe(false);
      });
    },

    get(): void {
      it("Getting items", () => {
        const width = args.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(blockWidth === -1 ? width + 100 : blockWidth);

        initArgs.forEach((arg) => {
          b.add(arg, getWidth(arg));
        });

        initArgs.forEach((arg) => {
          expect(b.get(arg)).toBe(getWidth(arg));
        });
      });
    },

    has(): void {
      it("Testing items", () => {
        const width = args.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(blockWidth === -1 ? width + 100 : blockWidth);

        initArgs.forEach((arg) => {
          b.add(arg, getWidth(arg));
        });

        initArgs.forEach((arg) => {
          expect(b.has(arg)).toBe(true);
        });
      });
    },

    clear(): void {
      it("Clearing", () => {
        const width = args.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(blockWidth === -1 ? width + 100 : blockWidth);

        initArgs.forEach((arg) => {
          b.add(arg, getWidth(arg));
        });

        expect(b.occupied).toBe(width);
        expect(b.size).toBe(args.length);

        b.clear();

        expect(b.occupied).toBe(0);
        expect(b.size).toBe(0);
        expect(b.isEmpty()).toBe(true);
        expect(b.isFull()).toBe(false);
      });
    },

    keys(): void {
      it("Looping on items", () => {
        const width = args.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(blockWidth === -1 ? width + 100 : blockWidth);

        initArgs.forEach((arg) => {
          b.add(arg, getWidth(arg));
        });

        expect(Array.from(b.keys())).toEqual(args);
      });
    },

    values(): void {
      it("Looping on widths", () => {
        const width = args.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(blockWidth === -1 ? width + 100 : blockWidth);

        initArgs.forEach((arg) => {
          b.add(arg, getWidth(arg));
        });

        expect(Array.from(b.values())).toEqual(args);
      });
    },

    entries(): void {
      it("Looping on entries", () => {
        const width = args.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(blockWidth === -1 ? width + 100 : blockWidth);

        initArgs.forEach((arg) => {
          b.add(arg, getWidth(arg));
        });

        expect(Array.from(b.entries())).toEqual(args.map((arg) => [arg, arg]));
      });
    },

    width: false, // see addItems
    occupied: false, // see addItems
    free: false, // see addItems
    size: false, // see addItems
    isEmpty: false, // see addItems
    isFull: false, // see addItems
  };
};
