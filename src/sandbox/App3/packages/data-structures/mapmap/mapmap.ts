import { MapMap as MapMapInterface } from "./types";

export class MapMap<A, B, T> implements MapMapInterface<A, B, T> {
  #rows: Map<A, Map<B, T>> = new Map();
  #size = 0;

  get size(): number {
    return this.#size;
  }

  isEmpty(): boolean {
    return this.#size === 0;
  }

  set(a: A, b: B, value: T): void {
    let row: Map<B, T>;

    if (this.#rows.has(a)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      row = this.#rows.get(a)!;
    } else {
      row = new Map();
      this.#rows.set(a, row);
    }

    if (!row.has(b)) {
      this.#size++;
    }

    row.set(b, value);
  }

  get(a: A, b: B): T | undefined {
    const row = this.#rows.get(a);

    if (row === undefined) {
      return;
    }

    return row.get(b);
  }

  has(a: A, b: B): boolean {
    const row = this.#rows.get(a);

    if (row === undefined) {
      return false;
    }

    return row.has(b);
  }

  delete(a: A, b: B): boolean {
    const row = this.#rows.get(a);

    if (row === undefined) {
      return false;
    }

    if (row.delete(b)) {
      if (row.size === 0) {
        this.#rows.delete(a);
      }
      this.#size--;
      return true;
    }

    return false;
  }
}
