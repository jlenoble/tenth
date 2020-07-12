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

    size: false, // see "set"
    isEmpty: false, // see "set"
  };
};
