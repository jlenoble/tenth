import { TestSuite } from "../../../testsuite";
import { Constructor } from "../../types";
import { GraphVertex } from "../../graph/types";
import { fillInitArgs } from "../fill-init-args";
import { GraphEdge } from "../../graph/graph-edge";
import { defaultCompare } from "../../../comparator";

export const tests = <T>(
  Structure: Constructor<GraphVertex<T>>,
  initArgs: T[]
): TestSuite => {
  initArgs = fillInitArgs(initArgs);
  const sortedArgs = Array.from(new Set(initArgs)).sort(defaultCompare);
  const duplicates: Map<T, Set<number>> = new Map(
    sortedArgs.map((arg) => [arg, new Set()])
  );

  initArgs.forEach((arg, i) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    duplicates.get(arg)!.add(i);
  });

  return {
    value(): void {
      it("Creating", () => {
        initArgs.forEach((a) => {
          const l = new Structure(a);
          expect(l.value).toBe(a);
          expect(l.degree).toBe(0);
        });
      });
    },

    addEdge(): void {
      it("Adding edges", () => {
        const vertices = initArgs.map((a) => {
          return new Structure(a);
        });

        vertices.forEach((v1) => {
          vertices.forEach((v2) => {
            const edge = new GraphEdge<T>(v1, v2);
            v1.addEdge(edge);
            v2.addEdge(edge);
          });
        });

        vertices.forEach((v) => {
          expect(v.degree).toBe(2 * sortedArgs.length - 1);
        });
      });
    },

    deleteEdge(): void {
      it("Deleting edges", () => {
        const vertices = initArgs.map((a) => {
          return new Structure(a);
        });

        const edges = vertices.map((v1) => {
          return vertices.map((v2) => {
            const edge = new GraphEdge<T>(v1, v2);
            v1.addEdge(edge);
            v2.addEdge(edge);
            return edge;
          });
        });

        vertices.forEach((v) => {
          expect(v.degree).toBe(2 * sortedArgs.length - 1);
        });

        vertices[0].deleteEdge(edges[0][0]);
        vertices[2].deleteEdge(edges[2][1]);

        vertices.forEach((v, i) => {
          if (i === 0 || i === 2) {
            expect(v.degree).toBe(2 * sortedArgs.length - 2);
          } else {
            expect(v.degree).toBe(2 * sortedArgs.length - 1);
          }
        });
      });
    },

    deleteAllEdges(): void {
      it("Deleting all edges", () => {
        const vertices = initArgs.map((a) => {
          return new Structure(a);
        });

        vertices.forEach((v1) => {
          vertices.forEach((v2) => {
            const edge = new GraphEdge<T>(v1, v2);
            v1.addEdge(edge);
            v2.addEdge(edge);
          });
        });

        vertices[0].deleteAllEdges();
        vertices[3].deleteAllEdges();

        vertices.forEach((v, i) => {
          if (i === 0 || i === 3) {
            expect(v.degree).toBe(0);
          } else {
            expect(v.degree).toBe(2 * sortedArgs.length - 1);
          }
        });
      });
    },

    hasEdge(): void {
      it("Testing edges", () => {
        const vertices = initArgs.map((a) => {
          return new Structure(a);
        });

        const edges = vertices.map((v1) => {
          return vertices.map((v2) => {
            const edge = new GraphEdge<T>(v1, v2);
            v1.addEdge(edge);
            v2.addEdge(edge);
            return edge;
          });
        });

        vertices[0].deleteEdge(edges[0][0]);
        vertices[1].deleteEdge(edges[1][2]);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const s0 = duplicates.get(initArgs[0])!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const s1 = duplicates.get(initArgs[1])!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const s2 = duplicates.get(initArgs[2])!;

        vertices.forEach((v, i) => {
          vertices.forEach((_, j) => {
            if ((s0.has(i) && s0.has(j)) || (s1.has(i) && s2.has(j))) {
              expect(v.hasEdge(edges[i][j])).toBe(false);
            } else {
              expect(v.hasEdge(edges[i][j])).toBe(true);
            }
          });
        });
      });
    },
  };
};

export const staticTests = <T>({
  length,
  name,
  Structure,
}: {
  length: number;
  name: string;
  Structure: Constructor<GraphVertex<T>>;
}): TestSuite => ({
  length({ it }) {
    it(() => {
      expect(Structure.length).toBe(length);
    });
  },

  name({ it }) {
    it(() => {
      expect(Structure.name).toBe(name);
    });
  },
});
