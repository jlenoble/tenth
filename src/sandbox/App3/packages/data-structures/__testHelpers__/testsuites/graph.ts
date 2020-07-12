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
    }, //

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

    vertices(): void {
      it("Looping on vertices", () => {
        const g = new Structure(initArgs);

        expect(Array.from(g.vertices()).map((vertex) => vertex.value)).toEqual(
          Array.from(args)
        );
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
            if (defaultCompare(a, b) !== 1) {
              edges.push(`${a}:${b}`);
            }
          });
        });

        expect(
          Array.from(g.edges()).map(
            ({ start, end }) => `${start.value}:${end.value}`
          )
        ).toEqual(edges);
      });
    },

    neighborsFor(): void {
      it("Looping on neighbors", () => {
        const g = new Structure(initArgs);

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b);
          });
        });

        for (const vertex of g.vertices()) {
          expect(
            Array.from(g.neighborsFor(vertex.value)).map(
              (neighbor) => neighbor.value
            )
          ).toEqual(sortedArgs.filter((arg) => arg !== vertex.value));
        }
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
              ({ start, end }) => `${start.value}:${end.value}`
            )
          ).toEqual(
            Array.from(args).map((arg) => {
              if (defaultCompare(vertex.value, arg) !== 1) {
                return `${vertex.value}:${arg}`;
              } else {
                return `${arg}:${vertex.value}`;
              }
            })
          );
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
              ({ start, end }) => `${start.value}:${end.value}`
            )
          ).toEqual(
            Array.from(args).map((arg) => {
              if (defaultCompare(vertex.value, arg) !== 1) {
                return `${vertex.value}:${arg}`;
              } else {
                return `${arg}:${vertex.value}`;
              }
            })
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
            if (defaultCompare(a, b) !== 1) {
              weight += +a + +b;
            }
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

        let size = (sortedArgs.length * (sortedArgs.length + 1)) / 2;
        sortedArgs.forEach((a) => {
          sortedArgs.forEach((b) => {
            if (defaultCompare(a, b) !== 1) {
              g.deleteEdge(a, b);
              size--;
            }
            expect(g.degree).toBe(size);
          });
        });
      });
    },

    adjacencyList(): void {
      it("Adjacency list", () => {
        const g = new Structure(initArgs);

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            g.addEdge(a, b, +a + +b);
          });
        });

        const list = g.adjacencyList;

        initArgs.forEach((a) => {
          initArgs.forEach((b) => {
            expect(list.get(a, b)).toBe(+a + +b);
          });
        });
      });
    },
  };
};
