import { TestSuite } from "../../../testsuite";
import { GraphConstructor } from "../../graph/types";
import { defaultCompare } from "../../../comparator";

export const tests = <T>(
  Structure: GraphConstructor<T>,
  initArgs: T[]
): TestSuite => {
  const args = new Set(initArgs);
  const sortedArgs = Array.from(args).sort(defaultCompare);

  return {
    addVertex(): void {
      it("Adding vertices", () => {
        const g = new Structure();
        initArgs.forEach((arg) => g.addVertex(arg));
        expect(g.size).toBe(sortedArgs.length);

        expect(Array.from(g).length).toBe(args.size);

        for (const arg of g) {
          expect(args.has(arg)).toBe(true);
        }
      });
    },
  };
};
