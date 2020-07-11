import { TestSuite } from "../../../testsuite";
import { GraphConstructor } from "../../graph/types";
import { defaultCompare } from "../../../comparator";
import { tests as graphTests } from "./graph";

export const tests = <T>(
  Structure: GraphConstructor<T>,
  initArgs: T[]
): TestSuite => {
  const args = new Set(initArgs);
  const sortedArgs = Array.from(args).sort(defaultCompare);

  return {
    ...graphTests(Structure, initArgs),

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

        expect(g.degree).toBe(sortedArgs.length * sortedArgs.length);

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
        const leftA = new Set(args);

        initArgs.forEach((a) => {
          const leftB = new Set(args);

          initArgs.forEach((b) => {
            if (leftB.has(b)) {
              leftB.delete(b);

              if (leftA.has(a)) {
                counter--;
              }
            }

            g.deleteEdge(a, b);

            expect(g.degree).toBe(counter);
          });

          leftA.delete(a);
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
                expect(start.value).toBe(a);
                expect(end.value).toBe(b);
              }
            }
          });
        });
      });
    },

    edges(): void {
      it("Looping on edges", () => {
        const g = new Structure(initArgs);

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b);
          });
        });

        const edges: string[] = [];

        sortedArgs.forEach((a) => {
          sortedArgs.forEach((b) => {
            edges.push(`${a}:${b}`);
          });
        });

        expect(
          Array.from(g.edges()).map(
            ({ start, end }) => `${start.value}:${end.value}`
          )
        ).toEqual(edges);
      });
    },
  };
};
