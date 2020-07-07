import { TestSuite } from "../../../testsuite";
import { DataStructure, Constructor } from "../../types";
import { fillInitArgs } from "../fill-init-args";

export const tests = <T, V = T>(
  Structure: Constructor<DataStructure<T | V>>,
  initArgs: T[]
): TestSuite => {
  initArgs = fillInitArgs(initArgs);

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

export const staticTests = <T>({
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
