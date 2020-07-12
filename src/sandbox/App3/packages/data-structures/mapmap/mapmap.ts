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

  clear(): void {
    for (const row of this.#rows.values()) {
      row.clear();
    }
    this.#rows.clear();
    this.#size = 0;
  }

  getRow(a: A): Map<B, T> {
    return new Map(this.#rows.get(a) || []);
  }

  getColumn(b: B): Map<A, T> {
    const m: Map<A, T> = new Map();

    for (const [a, row] of this.#rows) {
      if (row.has(b)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        m.set(a, row.get(b)!);
      }
    }

    return m;
  }

  *iterateRow(a: A): IterableIterator<T> {
    if (this.#rows.has(a)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      yield* this.#rows.get(a)!.values();
    }
  }

  *iterateColumn(b: B): IterableIterator<T> {
    for (const row of this.#rows.values()) {
      if (row.has(b)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        yield row.get(b)!;
      }
    }
  }

  *iterateRows(): IterableIterator<Map<B, T>> {
    for (const row of this.#rows.values()) {
      yield new Map(row);
    }
  }

  *iterateByRow(): IterableIterator<T> {
    for (const row of this.#rows.values()) {
      yield* row.values();
    }
  }
}
