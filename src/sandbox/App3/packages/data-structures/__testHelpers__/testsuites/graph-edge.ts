import { TestSuite } from "../../../testsuite";
import { Constructor } from "../../types";
import { GraphEdge } from "../../graph/types";
import { fillInitArgs } from "../fill-init-args";

export const tests = <T, V = T>(
  Structure: Constructor<GraphEdge<T | V>>,
  initArgs: T[]
): TestSuite => {
  initArgs = fillInitArgs(initArgs);

  return {
    start(): void {
      it("creating (default weight)", () => {
        initArgs.reduce((a, b) => {
          const l = new Structure(a, b);
          expect(l.start).toBe(a);
          expect(l.end).toBe(b);
          expect(l.weight).toBe(1);
          return b;
        });
      });

      it("creating (setting weight)", () => {
        initArgs.reduce((a, b) => {
          const l = new Structure(a, b, "" + a + b);
          expect(l.start).toBe(a);
          expect(l.end).toBe(b);
          expect(l.weight).toBe("" + a + b);
          return b;
        });
      });
    },

    end: false, // see start
    weight: false, // see start
  };
};

export const staticTests = <T>({
  length,
  name,
  Structure,
}: {
  length: number;
  name: string;
  Structure: Constructor<GraphEdge<T>>;
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
