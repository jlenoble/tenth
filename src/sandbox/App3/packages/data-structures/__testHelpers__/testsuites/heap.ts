import { TestSuite } from "../../../testsuite";
import { HeapConstructor, MinHeap } from "../../heap";
import { fillInitArgs } from "../fill-init-args";
import { tests as dataStructureTests } from "./data-structure";
import { Comparator } from "../../../comparator";

export const tests = <T>(
  Structure: HeapConstructor<T>,
  initArgs: T[]
): TestSuite => {
  initArgs = fillInitArgs(initArgs);
  const h0 = new Structure();
  const isMinHeap = h0 instanceof MinHeap;
  const rightOrder = (a: T, b: T): boolean => h0.pairIsInCorrectOrder(a, b);

  return {
    ...dataStructureTests(Structure, initArgs),

    comparator({ it }) {
      it(() => {
        const h = new Structure(initArgs);
        expect(h.comparator).toBeInstanceOf(Comparator);
      });
    },

    poll() {
      it("polling", () => {
        const h = new Structure(initArgs);
        const items: T[] = [];

        let a = h.poll();
        for (let i = 1; i < initArgs.length; i++) {
          const b = h.poll();
          if (a == undefined || b === undefined) {
            break;
          }
          items.push(a);
          if (i === initArgs.length - 1) {
            items.push(b);
          }
          expect(rightOrder(a, b)).toBe(true);
          a = b;
        }

        expect(items).toEqual(
          initArgs
            .slice()
            .sort(
              isMinHeap
                ? h.comparator.compare
                : (a: T, b: T) => h.comparator.compare(b, a)
            )
        );
      });
    },

    pairIsInCorrectOrder() {
      it("comparing elements", () => {
        const h = new Structure(initArgs);

        let a = h.poll();
        for (let i = 1; i < initArgs.length; i++) {
          const b = h.poll();
          if (a == undefined || b === undefined) {
            break;
          }
          expect(h.pairIsInCorrectOrder(a, b)).toBe(true);
          a = b;
        }
      });
    },

    peek() {
      it("peeking", () => {
        const h = new Structure(initArgs);

        for (let i = 0; i < initArgs.length; i++) {
          const a = h.peek();
          const b = h.poll();
          expect(a).toBe(b);
        }
      });
    },

    getParentIndex() {
      it("getting left child index", () => {
        const h = new Structure(initArgs);

        for (let i = 0; i < initArgs.length; i++) {
          expect(h.getParentIndex(i)).toBe(Math.floor((i - 1) / 2));
        }
      });
    },

    getLeftChildIndex() {
      it("getting left child index", () => {
        const h = new Structure(initArgs);

        for (let i = 0; i < initArgs.length; i++) {
          expect(h.getLeftChildIndex(i)).toBe(2 * i + 1);
        }
      });
    },

    getRightChildIndex() {
      it("getting right child index", () => {
        const h = new Structure(initArgs);

        for (let i = 0; i < initArgs.length; i++) {
          expect(h.getRightChildIndex(i)).toBe(2 * i + 2);
        }
      });
    },

    add() {
      it("adding", () => {
        const h = new Structure();
        const items: T[] = [];

        h.add(initArgs[0]);
        expect(Array.from(h)).toEqual([initArgs[0]]);

        h.add(initArgs[1]).add(initArgs[2]);

        for (let i = 0; i < 3; i++) {
          const b = h.poll();
          if (b === undefined) {
            break;
          }
          items.push(b);
        }

        expect(items).toEqual(
          initArgs
            .slice(0, 3)
            .sort(
              isMinHeap
                ? h.comparator.compare
                : (a: T, b: T) => h.comparator.compare(b, a)
            )
        );

        items.length = 0;
        let args: T[] = initArgs.slice();

        for (const a of args) {
          h.add(a);
        }

        for (let i = 0; i < initArgs.length; i++) {
          const b = h.poll();
          if (b === undefined) {
            break;
          }
          items.push(b);
        }

        expect(items).toEqual(
          initArgs
            .slice()
            .sort(
              isMinHeap
                ? h.comparator.compare
                : (a: T, b: T) => h.comparator.compare(b, a)
            )
        );

        items.length = 0;
        args = initArgs.slice().reverse();

        for (const a of args) {
          h.add(a);
        }

        for (let i = 0; i < initArgs.length; i++) {
          const b = h.poll();
          if (b === undefined) {
            break;
          }
          items.push(b);
        }

        expect(items).toEqual(
          initArgs
            .slice()
            .sort(
              isMinHeap
                ? h.comparator.compare
                : (a: T, b: T) => h.comparator.compare(b, a)
            )
        );
      });
    },

    remove() {
      let h = new Structure(initArgs);
      const items: T[] = [];

      expect(h.size).toBe(initArgs.length);
      h.remove(initArgs[0]);
      expect(h.size).toBeLessThan(initArgs.length);

      for (let i = 0; i < initArgs.length - h.size; i++) {
        const b = h.poll();
        if (b === undefined) {
          break;
        }
        items.push(b);
      }

      expect(items).toEqual(
        initArgs
          .filter((value) => value !== initArgs[0])
          .sort(
            isMinHeap
              ? h.comparator.compare
              : (a: T, b: T) => h.comparator.compare(b, a)
          )
      );

      h = new Structure(initArgs);
      items.length = 0;

      expect(h.size).toBe(initArgs.length);
      h.remove(initArgs[2]).remove(initArgs[3]);
      expect(h.size).toBeLessThan(initArgs.length);

      for (let i = 0; i < initArgs.length - h.size; i++) {
        const b = h.poll();
        if (b === undefined) {
          break;
        }
        items.push(b);
      }

      expect(items).toEqual(
        initArgs
          .filter((value) => value !== initArgs[2] && value !== initArgs[3])
          .sort(
            isMinHeap
              ? h.comparator.compare
              : (a: T, b: T) => h.comparator.compare(b, a)
          )
      );
    },

    // private methods
    swap: false,
    heapifyUp: false,
    heapifyDown: false,
  };
};
