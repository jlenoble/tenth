import { TestSuite } from "../../../testsuite";
import { MinHeap } from "../../heap";
import { PriorityQueueConstructor } from "../../priority-queue";
import { fillInitArgs } from "../fill-init-args";
import { tests as commonTests } from "./common";
import { Comparator } from "../../../comparator";

export const tests = <T, V>(
  Structure: PriorityQueueConstructor<V>,
  initArgs: T[],
  {
    getValue = (obj: V) => obj,
    getPriority = () => 0,
  }: {
    getValue?: (obj: any) => V; // eslint-disable-line @typescript-eslint/no-explicit-any
    getPriority?: (obj: any) => number; // eslint-disable-line @typescript-eslint/no-explicit-any
  } = {}
): TestSuite => {
  initArgs = fillInitArgs<T>(initArgs);
  const h0 = new Structure();
  const isMinHeap = h0 instanceof MinHeap;
  const rightOrder = (a: V, b: V): boolean => h0.pairIsInCorrectOrder(a, b);

  const values: V[] = initArgs.map(getValue);
  const priorities: Map<V, number> = new Map(
    initArgs.map((obj) => [getValue(obj), getPriority(obj)])
  );

  const compare = (items: V[], items2: V[]) => {
    expect(items.length).toEqual(items2.length);

    for (let i = 0; i < items.length; i++) {
      expect(
        items[i] === items2[i] ||
          priorities.get(items[i]) === priorities.get(items2[i])
      ).toBe(true);
    }
  };

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
        const items: V[] = [];

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

        const items2 = values
          .slice()
          .sort(
            isMinHeap
              ? h.comparator.compare
              : (a: V, b: V) => h.comparator.compare(b, a)
          );

        compare(items, items2);
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
        const items: V[] = [];

        h.add(values[0], getPriority(initArgs[0]));
        expect(Array.from(h)).toEqual([values[0]]);

        const b = h.poll();

        if (b) {
          expect(b).toBe(values[0]);
        }

        items.length = 0;
        let args: T[] = initArgs.slice();

        for (const a of args) {
          h.add(getValue(a), getPriority(a));
        }

        for (let i = 0; i < initArgs.length; i++) {
          const b = h.poll();
          if (b === undefined) {
            break;
          }
          items.push(b);
        }

        let items2 = values.sort(
          isMinHeap
            ? h.comparator.compare
            : (a: V, b: V) => h.comparator.compare(b, a)
        );

        compare(items, items2);

        items.length = 0;
        args = initArgs.slice().reverse();

        for (const a of args) {
          h.add(getValue(a), getPriority(a));
        }

        for (let i = 0; i < initArgs.length; i++) {
          const b = h.poll();
          if (b === undefined) {
            break;
          }
          items.push(b);
        }

        items2 = values.sort(
          isMinHeap
            ? h.comparator.compare
            : (a: V, b: V) => h.comparator.compare(b, a)
        );

        compare(items, items2);
      });
    },

    remove() {
      let h = new Structure(initArgs);
      const items: V[] = [];

      expect(h.size).toBe(initArgs.length);
      h.remove(values[0]);
      expect(h.size).toBeLessThan(initArgs.length);

      for (let i = 0; i < initArgs.length - h.size; i++) {
        const b = h.poll();
        if (b === undefined) {
          break;
        }
        items.push(b);
      }

      let items2 = values
        .filter((v) => v !== values[0])
        .sort(
          isMinHeap
            ? h.comparator.compare
            : (a: V, b: V) => h.comparator.compare(b, a)
        );

      compare(items, items2);

      h = new Structure(initArgs);
      items.length = 0;

      expect(h.size).toBe(initArgs.length);
      h.remove(values[2]).remove(values[3]);
      expect(h.size).toBeLessThan(initArgs.length);

      for (let i = 0; i < initArgs.length - h.size; i++) {
        const b = h.poll();
        if (b === undefined) {
          break;
        }
        items.push(b);
      }

      items2 = values
        .filter((v) => v !== values[2] && v !== values[3])
        .sort(
          isMinHeap
            ? h.comparator.compare
            : (a: V, b: V) => h.comparator.compare(b, a)
        );

      compare(items, items2);
    },

    // private methods
    swap: false,
    heapifyUp: false,
    heapifyDown: false,
  };
};
