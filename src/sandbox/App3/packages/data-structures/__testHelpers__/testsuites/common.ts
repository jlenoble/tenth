import { TestSuite } from "../../../testsuite";
import { DataStructure, Constructor, Node } from "../../types";

export const tests = <T, N extends Node<T>>(
  Structure: Constructor<DataStructure<T>>,
  initArgs: T[]
): TestSuite => {
  return {
    size(): void {
      it("reading size", () => {
        const l = new Structure(initArgs);
        expect(l.size).toBe(initArgs.length);
      });
    },

    isEmpty(): void {
      it("checking if empty", () => {
        const l1 = new Structure();
        expect(l1.isEmpty()).toBe(true);
        const l2 = new Structure(initArgs);
        expect(l2.isEmpty()).toBe(false);
      });
    },
  };
};

export const staticTests = <T, N extends Node<T>>({
  length,
  name,
  Structure,
}: {
  length: number;
  name: string;
  Structure: Constructor<DataStructure<T>>;
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
