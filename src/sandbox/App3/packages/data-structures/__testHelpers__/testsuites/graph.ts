import { TestSuite } from "../../../testsuite";
import { GraphConstructor } from "../../graph/types";
import { defaultCompare } from "../../../comparator";

export const tests = <T>(
  Structure: GraphConstructor<T>,
  initArgs: T[]
): TestSuite => {
  const sortedArgs = Array.from(new Set(initArgs)).sort(defaultCompare);

  return {
    addVertex(): void {
      it("Adding vertices", () => {
        const g = new Structure();
        initArgs.forEach((arg) => g.addVertex(arg));
        expect(g.size).toBe(sortedArgs.length);
      });
    },
  };
};
