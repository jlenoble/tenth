import { TestSuite } from "../../../testsuite";
import { DataStructure, Constructor, Node } from "../../types";

export const tests = <T, N extends Node<T>>(
  Structure: Constructor<DataStructure<T, N>>,
  initArgs: T[]
): TestSuite => {
  return {
    enqueue(): void {
      it("enqueueing", () => {
        const l = new Structure();

        let n = l.enqueue(initArgs[0]);

        expect(l.size).toBe(1);
        expect(l.size).toBe(n);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 1));

        n = l.enqueue(initArgs[1], initArgs[2]);

        expect(l.size).toBe(3);
        expect(l.size).toBe(n);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 3));

        n = l.enqueue(initArgs[3], initArgs[4], initArgs[5]);

        expect(l.size).toBe(6);
        expect(l.size).toBe(n);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 6));
      });
    },

    dequeue(): void {
      it("dequeueing", () => {
        const l = new Structure();
        initArgs.forEach((arg) => l.enqueue(arg));

        expect(l.size).toBe(initArgs.length);
        expect(Array.from(l)).toEqual(initArgs);

        const n1 = l.dequeue();

        expect(l.size).toBe(initArgs.length - 1);
        expect(Array.from(l)).toEqual(initArgs.slice(1));
        expect(n1).toBe(initArgs[0]);

        const n2 = l.dequeue();
        const n3 = l.dequeue();

        expect(l.size).toBe(initArgs.length - 3);
        expect(Array.from(l)).toEqual(initArgs.slice(3));
        expect(n2).toBe(initArgs[1]);
        expect(n3).toBe(initArgs[2]);

        let n = n1;
        initArgs.slice(3).forEach(() => {
          n = l.dequeue();
        });

        expect(l.size).toBe(0);
        expect(Array.from(l)).toEqual([]);
        expect(n).toBe(initArgs[initArgs.length - 1]);

        const n4 = l.dequeue();

        expect(l.size).toBe(0);
        expect(Array.from(l)).toEqual([]);
        expect(n4).toBeUndefined();
      });
    },
  };
};
