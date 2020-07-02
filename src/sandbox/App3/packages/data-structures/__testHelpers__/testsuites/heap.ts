import { TestSuite } from "../../../testsuite";
import { HeapConstructor, MinHeap } from "../../heap";
import { fillInitArgs } from "../fill-init-args";
import { tests as commonTests } from "./common";
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
    ...commonTests(Structure, initArgs),

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

    swap() {
      it("swapping", () => {
        const h = new Structure(initArgs);
        const items0 = Array.from(h);
        const items = Array.from(h);

        for (let i = 1; i < initArgs.length; i++) {
          h.swap(i - 1, i);
          const tmp = items[i - 1];
          items[i - 1] = items[i];
          items[i] = tmp;
          expect(Array.from(h)).toEqual(items);
        }

        expect(Array.from(h)).not.toEqual(items0);
        expect(Array.from(h)[initArgs.length - 1]).toEqual(items0[0]);
        expect(Array.from(h)[0]).toEqual(items0[1]);
      });
    },
  };
};
