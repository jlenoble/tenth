import { TestSuite } from "../../../testsuite";
import { MapMapConstructor } from "../../mapmap/types";
import { defaultCompare } from "../../../comparator";
import { tests as dataStructureTests } from "./data-structure";

export const tests = (
  Structure: MapMapConstructor<number, number, number>,
  initArgs: number[]
): TestSuite => {
  const args = new Set(initArgs);
  const sortedArgs = Array.from(args).sort(defaultCompare);

  return {
    ...dataStructureTests(Structure, sortedArgs),

    set(): void {
      it("Setting elements", () => {
        const m = new Structure();

        expect(m.isEmpty()).toBe(true);
        expect(m.size).toBe(0);

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, 1);
          }
        }

        expect(m.isEmpty()).toBe(false);
        expect(m.size).toBe(sortedArgs.length ** 2);
      });
    },

    get(): void {
      it("Getting elements", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a + b);
          }
        }

        for (const a of initArgs) {
          for (const b of initArgs) {
            expect(m.get(a, b)).toBe(a + b);
          }
        }
      });
    },

    has(): void {
      it("Testing elements", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a * b);
          }
        }

        let min = 0;
        let max = 0;
        for (const a of initArgs) {
          if (a < min) {
            min = a;
          } else if (a > max) {
            max = a;
          }

          for (const b of initArgs) {
            expect(m.has(a, b)).toBe(true);
          }
        }

        for (const a of initArgs) {
          for (const b of initArgs) {
            expect(m.has(a, min - 1)).toBe(false);
            expect(m.has(a, max + 2)).toBe(false);
            expect(m.has(min - 3, b)).toBe(false);
            expect(m.has(max + 4, b)).toBe(false);
          }
        }
      });
    },

    delete(): void {
      it("Deleting elements", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a + b);
          }
        }

        let size = m.size;
        for (const a of initArgs) {
          for (const b of initArgs) {
            if (m.has(a, b)) {
              expect(m.delete(a, b)).toBe(true);
              size--;
            } else {
              expect(m.delete(a, b)).toBe(false);
            }

            expect(m.size).toBe(size);
          }
        }
      });
    },

    clear(): void {
      it("Clearing", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a + b);
          }
        }

        expect(m.isEmpty()).toBe(false);
        expect(m.size).toBe(sortedArgs.length ** 2);

        m.clear();

        expect(m.isEmpty()).toBe(true);
        expect(m.size).toBe(0);
      });
    },

    getRow(): void {
      it("Getting a row", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a - b);
          }
        }

        for (const a of initArgs) {
          const row = m.getRow(a);

          expect(row).toBeDefined();

          if (row) {
            expect(Array.from(row.keys())).toEqual(Array.from(args));
            expect(Array.from(row.values())).toEqual(
              Array.from(args).map((b) => a - b)
            );
          }
        }
      });
    },

    getColumn(): void {
      it("Getting a column", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a - b);
          }
        }

        for (const b of initArgs) {
          const column = m.getColumn(b);

          expect(column).toBeDefined();

          if (column) {
            expect(Array.from(column.keys())).toEqual(Array.from(args));
            expect(Array.from(column.values())).toEqual(
              Array.from(args).map((a) => a - b)
            );
          }
        }
      });
    },

    iterateRow(): void {
      it("Iterating a row", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a - b);
          }
        }

        for (const a of initArgs) {
          expect(Array.from(m.iterateRow(a))).toEqual(
            Array.from(args).map((b) => a - b)
          );
        }
      });
    },

    iterateColumn(): void {
      it("Iterating a column", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a - b);
          }
        }

        for (const b of initArgs) {
          expect(Array.from(m.iterateColumn(b))).toEqual(
            Array.from(args).map((a) => a - b)
          );
        }
      });
    },

    iterateRows(): void {
      it("Iterating rows", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a - b);
          }
        }

        const _args = Array.from(args);

        let counter = 0;
        for (const row of m.iterateRows()) {
          expect(Array.from(row.values())).toEqual(
            _args.map((b) => _args[counter] - b)
          );
          counter++;
        }
      });
    },

    iterateColumns(): void {
      it("Iterating columns", () => {
        const m = new Structure();

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a - b);
          }
        }

        const _args = Array.from(args);

        let counter = 0;
        for (const column of m.iterateColumns()) {
          expect(Array.from(column.values())).toEqual(
            _args.map((a) => a - _args[counter])
          );
          counter++;
        }
      });
    },

    iterateByRow(): void {
      it("Iterating by row", () => {
        const m = new Structure();
        const values: number[] = [];

        for (const a of initArgs) {
          for (const b of initArgs) {
            m.set(a, b, a - b);
          }
        }

        for (const a of args) {
          for (const b of args) {
            values.push(a - b);
          }
        }

        expect(Array.from(m.iterateByRow())).toEqual(values);
      });
    },

    size: false, // see "set"
    isEmpty: false, // see "set"
  };
};
