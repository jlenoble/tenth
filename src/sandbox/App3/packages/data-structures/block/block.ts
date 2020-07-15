import { Block as BlockInterface } from "./types";

export class Block<T> implements BlockInterface<T> {
  #width: number;
  #free: number;
  #items: Map<T, number>;

  get width(): number {
    return this.#width;
  }

  get occupied(): number {
    return this.#width - this.#free;
  }

  get free(): number {
    return this.#free;
  }

  get size(): number {
    return this.#items.size;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.#items.keys();
  }

  constructor(width: number) {
    this.#width = width;
    this.#free = width;
    this.#items = new Map();
  }

  isEmpty(): boolean {
    return this.#items.size === 0;
  }

  isFull(): boolean {
    return this.#free === 0;
  }

  add(item: T, width: number): { free: number; added: boolean } {
    if (width > 0) {
      const _width = this.#items.get(item);

      if (_width !== undefined) {
        if (_width !== width) {
          const free = this.#free - width + _width;

          if (free >= 0) {
            this.#items.set(item, width);
            this.#free = free;
          } else {
            this.#items.set(item, this.#free);
            this.#free = 0;
          }

          return { free, added: true };
        }
      } else if (this.#free > 0) {
        const free = this.#free - width;

        if (free >= 0) {
          this.#items.set(item, width);
          this.#free = free;
        } else {
          this.#items.set(item, this.#free);
          this.#free = 0;
        }

        return { free, added: true };
      }
    }

    return { free: this.#free, added: false };
  }

  delete(item: T): { free: number; deleted: boolean } {
    const width = this.#items.get(item);

    if (width === undefined) {
      return { free: this.#free, deleted: false };
    }

    this.#free += width;
    this.#items.delete(item);

    return { free: this.#free, deleted: true };
  }

  get(item: T): number | undefined {
    return this.#items.get(item);
  }

  has(item: T): boolean {
    return this.#items.has(item);
  }

  clear(): void {
    this.#items.clear();
    this.#free = this.#width;
  }
}
