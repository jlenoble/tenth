import { TestSuite } from "../../../testsuite";
import { GraphConstructor } from "../../graph/types";
import { defaultCompare } from "../../../comparator";
import { tests as dataStructureTests } from "./data-structure";

export const tests = <T>(
  Structure: GraphConstructor<T>,
  initArgs: T[]
): TestSuite => {
  const args = new Set(initArgs);
  const sortedArgs = Array.from(args).sort(defaultCompare);

  return {
    ...dataStructureTests(Structure, sortedArgs),

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

    deleteVertex(): void {
      it("Deleting vertices", () => {
        const g = new Structure(initArgs);
        expect(Array.from(g).length).toBe(args.size);

        for (const arg of g) {
          expect(args.has(arg)).toBe(true);
        }

        sortedArgs.forEach((arg, i) => {
          g.deleteVertex(arg);
          expect(g.size).toBe(sortedArgs.length - i - 1);
        });
      });
    },

    getVertex(): void {
      it("Getting vertices", () => {
        const g = new Structure(initArgs);

        initArgs.forEach((arg) => {
          const vertex = g.getVertex(arg);
          expect(vertex?.value).toBe(arg);
        });
      });
    },

    addEdge(): void {
      it("Adding edges - unique values", () => {
        const g = new Structure();
        sortedArgs.reduce((a, b) => {
          g.addEdge(a, b);
          return b;
        });
        expect(g.degree).toBe(sortedArgs.length - 1);

        expect(Array.from(g).length).toBe(args.size);

        for (const arg of g) {
          expect(args.has(arg)).toBe(true);
        }
      });

      it("Adding edges - redundant values", () => {
        const g = new Structure();

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b);
          });
        });

        expect(g.degree).toBe(
          (sortedArgs.length * (sortedArgs.length + 1)) / 2
        );

        expect(Array.from(g).length).toBe(args.size);

        for (const arg of g) {
          expect(args.has(arg)).toBe(true);
        }
      });
    },

    deleteEdge(): void {
      it("Deleting edges", () => {
        const g = new Structure(args);

        args.forEach((a) => {
          args.forEach((b) => {
            g.addEdge(a, b);
          });
        });

        let counter = g.degree;
        const leftAB: Map<T, Map<T, boolean>> = new Map(
          Array.from(args).map((arg) => [
            arg,
            new Map(Array.from(args).map((arg) => [arg, true])),
          ])
        );

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            if (leftAB?.get(a)?.get(b)) {
              leftAB.get(a)?.delete(b);
              leftAB.get(b)?.delete(a);
              counter--;
            }

            g.deleteEdge(a, b);

            expect(g.degree).toBe(counter);
          });
        });
      });
    },

    findEdge(): void {
      it("finding edges", () => {
        const g = new Structure(initArgs);

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b);
          });
        });

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            const edge = g.findEdge(a, b);
            expect(edge).toBeDefined();

            if (edge) {
              const { start, end } = edge;
              expect(start).toBeDefined();
              expect(end).toBeDefined();

              if (start && end) {
                if (defaultCompare(a, b) !== 1) {
                  expect(start.value).toBe(a);
                  expect(end.value).toBe(b);
                } else {
                  expect(start.value).toBe(b);
                  expect(end.value).toBe(a);
                }
              }
            }
          });
        });
      });
    },
  };
};
