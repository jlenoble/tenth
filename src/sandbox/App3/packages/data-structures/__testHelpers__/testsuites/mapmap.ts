import { TestSuite } from "../../../testsuite";
import { MapMapConstructor } from "../../mapmap/types";
import { defaultCompare } from "../../../comparator";
import { tests as dataStructureTests } from "./data-structure";

export const tests = (
  Structure: MapMapConstructor<number, number, number>,
  initArgs: number[]
): TestSuite => {
  const sortedArgs = Array.from(new Set(initArgs)).sort(defaultCompare);

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

    size: false, // see "set"
    isEmpty: false, // see "set"
  };
};
