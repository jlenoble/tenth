import { TestSuite } from "../../../testsuite";
import { DataStructure, Constructor, Node } from "../../types";

export const tests = <T, N extends Node<T>>(
  Structure: Constructor<DataStructure<T, N>>,
  initArgs: T[]
): TestSuite => {
  return {
    push(): void {
      it("pushing", () => {
        const l = new Structure();

        let n = l.push(initArgs[0]);

        expect(l.size).toBe(1);
        expect(l.size).toBe(n);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 1).reverse());

        n = l.push(initArgs[1], initArgs[2]);

        expect(l.size).toBe(3);
        expect(l.size).toBe(n);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 3).reverse());

        n = l.push(initArgs[3], initArgs[4], initArgs[5]);

        expect(l.size).toBe(6);
        expect(l.size).toBe(n);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 6).reverse());
      });
    },

    pop(): void {
      it("popping", () => {
        const l = new Structure();
        initArgs.forEach((arg) => l.push(arg));

        expect(l.size).toBe(initArgs.length);
        expect(Array.from(l)).toEqual(initArgs.slice().reverse());

        const n1 = l.pop();

        expect(l.size).toBe(initArgs.length - 1);
        expect(Array.from(l)).toEqual(
          initArgs.slice(0, initArgs.length - 1).reverse()
        );
        expect(n1).toBe(initArgs[initArgs.length - 1]);

        const n2 = l.pop();
        const n3 = l.pop();

        expect(l.size).toBe(initArgs.length - 3);
        expect(Array.from(l)).toEqual(
          initArgs.slice(0, initArgs.length - 3).reverse()
        );
        expect(n2).toBe(initArgs[initArgs.length - 2]);
        expect(n3).toBe(initArgs[initArgs.length - 3]);

        let n = n1;
        initArgs.slice(0, initArgs.length - 3).forEach(() => {
          n = l.pop();
        });

        expect(l.size).toBe(0);
        expect(Array.from(l)).toEqual([]);
        expect(n).toBe(initArgs[0]);

        const n4 = l.pop();

        expect(l.size).toBe(0);
        expect(Array.from(l)).toEqual([]);
        expect(n4).toBeUndefined();
      });
    },

    peek(): void {
      it("peeking", () => {
        const l = new Structure();
        initArgs.forEach((arg) => l.push(arg));

        expect(l.peek()).toBe(initArgs[initArgs.length - 1]);

        l.pop();

        expect(l.peek()).toBe(initArgs[initArgs.length - 2]);
      });
    },
  };
};