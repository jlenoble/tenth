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

    edgesStartingFrom(): void {
      it("Looping on edges from a vertex", () => {
        const g = new Structure(initArgs);

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b);
          });
        });

        for (const vertex of g.vertices()) {
          expect(Array.from(g.edgesStartingFrom(vertex.value)).length).toBe(
            sortedArgs.length
          );
          expect(
            Array.from(g.edgesStartingFrom(vertex.value)).map(
              ({ end: { value } }) => value
            )
          ).toEqual(Array.from(args));
        }
      });
    },

    edgesEndingTo(): void {
      it("Looping on edges to a vertex", () => {
        const g = new Structure(initArgs);

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b);
          });
        });

        for (const vertex of g.vertices()) {
          expect(Array.from(g.edgesEndingTo(vertex.value)).length).toBe(
            sortedArgs.length
          );
          expect(
            Array.from(g.edgesEndingTo(vertex.value)).map(
              ({ start: { value } }) => value
            )
          ).toEqual(Array.from(args));
        }
      });
    },

    edgesFor(): void {
      it("Looping on edges from and to a vertex", () => {
        const g = new Structure(initArgs);

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b);
          });
        });

        for (const vertex of g.vertices()) {
          expect(Array.from(g.edgesFor(vertex.value)).length).toBe(
            2 * sortedArgs.length - 1
          );
          expect(
            Array.from(g.edgesFor(vertex.value)).map(
              ({ start, end }) => `${start.value}:${end.value}`
            )
          ).toEqual(
            Array.from(args)
              .map((arg) => `${vertex.value}:${arg}`)
              .concat(
                Array.from(args)
                  .filter((arg) => arg !== vertex.value)
                  .map((arg) => `${arg}:${vertex.value}`)
              )
          );
        }
      });
    },

    weight({ it }): void {
      it(() => {
        const g = new Structure(initArgs);

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b, +a + +b);
          });
        });

        let weight = 0;
        sortedArgs.forEach((a) => {
          sortedArgs.forEach((b) => {
            weight += +a + +b;
          });
        });

        expect(g.weight).toBe(weight);
      });
    },

    degree({ it }): void {
      it(() => {
        const g = new Structure(initArgs);

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b);
          });
        });

        let size = sortedArgs.length * sortedArgs.length;
        sortedArgs.forEach((a) => {
          sortedArgs.forEach((b) => {
            g.deleteEdge(a, b);
            size--;
            expect(g.degree).toBe(size);
          });
        });
      });
    },

    dftIterate(): void {
      it("Depth first traversal", () => {
        /*
            0     1  ___2
            |   __|_/  /|
            |  |  |   / |
            3  |  4__/  5
             \ | / \   /|
              \|/  _\_/ |
               6  /  \__7
               | /
               8/
        
          expecting: 0 3 6 8 1 4 7 2 5
        */
        const initArgs = ([0, 1, 2, 3, 4, 5, 6, 7, 8] as unknown) as T[];
        const g = new Structure(initArgs);

        g.addEdge(initArgs[5], initArgs[8]);
        g.addEdge(initArgs[6], initArgs[8]);
        g.addEdge(initArgs[1], initArgs[4]);
        g.addEdge(initArgs[0], initArgs[3]);
        g.addEdge(initArgs[4], initArgs[7]);
        g.addEdge(initArgs[4], initArgs[6]);
        g.addEdge(initArgs[5], initArgs[7]);
        g.addEdge(initArgs[2], initArgs[6]);
        g.addEdge(initArgs[3], initArgs[6]);
        g.addEdge(initArgs[2], initArgs[5]);
        g.addEdge(initArgs[2], initArgs[4]);

        expect(Array.from(g.dftIterate()).map((v) => v.value)).toEqual([
          0,
          3,
          6,
          8,
          1,
          4,
          7,
          2,
          5,
        ]);
      });
    },

    bftIterate(): void {
      it("Breadth first traversal", () => {
        /*
            0     1  ___2
            |   __|_/  /|
            |  |  |   / |
            3  |  4__/  5
             \ | / \   /|
              \|/  _\_/ |
               6  /  \__7
               | /
               8/
        
          expecting: 0 1 2 3 4 5 6 7 8
        */
        const initArgs = ([0, 1, 2, 3, 4, 5, 6, 7, 8] as unknown) as T[];
        const g = new Structure(initArgs.slice().reverse());

        g.addEdge(initArgs[5], initArgs[8]);
        g.addEdge(initArgs[6], initArgs[8]);
        g.addEdge(initArgs[1], initArgs[4]);
        g.addEdge(initArgs[0], initArgs[3]);
        g.addEdge(initArgs[4], initArgs[7]);
        g.addEdge(initArgs[4], initArgs[6]);
        g.addEdge(initArgs[5], initArgs[7]);
        g.addEdge(initArgs[2], initArgs[6]);
        g.addEdge(initArgs[3], initArgs[6]);
        g.addEdge(initArgs[2], initArgs[5]);
        g.addEdge(initArgs[2], initArgs[4]);

        expect(Array.from(g.bftIterate()).map((v) => v.value)).toEqual(
          initArgs
        );
      });
    },
  };
};
