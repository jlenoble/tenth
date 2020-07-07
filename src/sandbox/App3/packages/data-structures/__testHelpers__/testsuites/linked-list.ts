import { TestSuite } from "../../../testsuite";
import { LinkedListConstructor, LinkedListNode } from "../../linked-list/types";
import { fillInitArgs } from "../fill-init-args";
import { tests as dataStructureTests } from "./data-structure";

export const tests = <T, N extends LinkedListNode<T>>(
  Structure: LinkedListConstructor<T, N>,
  initArgs: T[]
): TestSuite => {
  initArgs = fillInitArgs(initArgs);

  return {
    ...dataStructureTests(Structure, initArgs),

    head(): void {
      it("reading head", () => {
        const l = new Structure();
        initArgs.forEach((arg) => l.append(arg));

        expect(l.head).toBe(initArgs[0]);
      });
    },

    tail(): void {
      it("reading tail", () => {
        const l = new Structure();
        initArgs.forEach((arg) => l.append(arg));

        expect(l.tail).toBe(initArgs[initArgs.length - 1]);
      });
    },

    append(): void {
      it("appending", () => {
        const l = new Structure();
        l.append(initArgs[0]);

        expect(l.size).toBe(1);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 1));

        l.append(initArgs[1]).append(initArgs[2]);

        expect(l.size).toBe(3);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 3));

        l.append(initArgs[3]).append(initArgs[4]).append(initArgs[5]);

        expect(l.size).toBe(6);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 6));
      });
    },

    prepend(): void {
      it("prepending", () => {
        const l = new Structure();

        l.prepend(initArgs[0]);

        expect(l.size).toBe(1);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 1).reverse());

        l.prepend(initArgs[1]).prepend(initArgs[2]);

        expect(l.size).toBe(3);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 3).reverse());

        l.prepend(initArgs[3]).prepend(initArgs[4]).prepend(initArgs[5]);

        expect(l.size).toBe(6);
        expect(Array.from(l)).toEqual(initArgs.slice(0, 6).reverse());
      });
    },

    deleteHead(): void {
      it("deleting head", () => {
        const l = new Structure();
        initArgs.forEach((arg) => l.append(arg));

        expect(l.size).toBe(initArgs.length);
        expect(Array.from(l)).toEqual(initArgs);

        const n1 = l.deleteHead();

        expect(l.size).toBe(initArgs.length - 1);
        expect(Array.from(l)).toEqual(initArgs.slice(1));
        expect(n1?.value).toBe(initArgs[0]);

        const n2 = l.deleteHead();
        const n3 = l.deleteHead();

        expect(l.size).toBe(initArgs.length - 3);
        expect(Array.from(l)).toEqual(initArgs.slice(3));
        expect(n2?.value).toBe(initArgs[1]);
        expect(n3?.value).toBe(initArgs[2]);

        let n = n1;
        initArgs.slice(3).forEach(() => {
          n = l.deleteHead();
        });

        expect(l.size).toBe(0);
        expect(Array.from(l)).toEqual([]);
        expect(n?.value).toBe(initArgs[initArgs.length - 1]);

        const n4 = l.deleteHead();

        expect(l.size).toBe(0);
        expect(Array.from(l)).toEqual([]);
        expect(n4).toBeNull();
      });
    },

    deleteTail(): void {
      it("deleting tail", () => {
        const l = new Structure();
        initArgs.forEach((arg) => l.append(arg));

        expect(l.size).toBe(initArgs.length);
        expect(Array.from(l)).toEqual(initArgs);

        const n1 = l.deleteTail();

        expect(l.size).toBe(initArgs.length - 1);
        expect(Array.from(l)).toEqual(initArgs.slice(0, -1));
        expect(n1?.value).toBe(initArgs[initArgs.length - 1]);

        const n2 = l.deleteTail();
        const n3 = l.deleteTail();

        expect(l.size).toBe(initArgs.length - 3);
        expect(Array.from(l)).toEqual(initArgs.slice(0, -3));
        expect(n2?.value).toBe(initArgs[initArgs.length - 2]);
        expect(n3?.value).toBe(initArgs[initArgs.length - 3]);

        let n = n1;
        initArgs.slice(0, -3).forEach(() => {
          n = l.deleteTail();
        });

        expect(l.size).toBe(0);
        expect(Array.from(l)).toEqual([]);
        expect(n?.value).toBe(initArgs[0]);

        const n4 = l.deleteTail();

        expect(l.size).toBe(0);
        expect(Array.from(l)).toEqual([]);
        expect(n4).toBeNull();
      });
    },
  };
};
