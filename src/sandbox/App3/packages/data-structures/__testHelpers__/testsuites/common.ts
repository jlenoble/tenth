import { TestSuite } from "../../../testsuite";
import { DataStructure, Constructor, Node } from "../../types";

export const tests = <T, N extends Node<T>>(
  Structure: Constructor<DataStructure<T, N>>,
  initArgs: T[]
): TestSuite => {
  return {
    size(): void {
      it("reading size", () => {
        const l = new Structure();
        initArgs.forEach((arg) => l.append(arg));

        expect(l.size).toBe(initArgs.length);
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
  Structure: Constructor<DataStructure<T, N>>;
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
