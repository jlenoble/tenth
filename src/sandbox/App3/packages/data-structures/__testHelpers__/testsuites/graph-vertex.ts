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
      it("deleting edges", () => {
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
