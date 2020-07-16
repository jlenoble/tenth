import { TestSuite } from "../../../testsuite";
import { BlocksConstructor } from "../../block/types";
import { tests as blockTests } from "./block";

export const tests = <T>(
  Structure: BlocksConstructor<T>,
  initArgs: T[],
  getWidth: (arg: T) => number,
  blockWidth: number
): TestSuite => {
  return {
    ...blockTests(Structure, initArgs, getWidth, blockWidth),

    add(): void {
      it("Add items", () => {
        const width = initArgs.reduce(
          (sum: number, arg: T) => sum + getWidth(arg),
          0
        );
        const b = new Structure(blockWidth);
        const _added: Set<T> = new Set();

        initArgs.forEach((arg) => {
          const { free, added } = b.add(arg, getWidth(arg));
          expect(added).toBe(!_added.has(arg));
          expect(free).toBeGreaterThanOrEqual(0);
          _added.add(arg);
        });

        expect(b.width).toBe(Math.ceil(width / blockWidth) * blockWidth);
        expect(b.occupied).toBe(width);
        expect(b.free).toBe(Math.ceil(width / blockWidth) * blockWidth - width);
        expect(b.size).toBe(initArgs.length);
        expect(b.isEmpty()).toBe(false);
        expect(b.isFull()).toBe(false);
      });
    },
  };
};
