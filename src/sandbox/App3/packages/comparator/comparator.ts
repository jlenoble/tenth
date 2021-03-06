export type ComparatorFunction<T> = (a: T, b: T) => -1 | 0 | 1;

export const defaultCompare = <T extends unknown>(a: T, b: T): -1 | 0 | 1 => {
  return a === b ? 0 : a < b ? -1 : 1;
};

export class Comparator<T> {
  #compare: ComparatorFunction<T>;
  equal: (a: T, b: T) => boolean;

  get compare(): ComparatorFunction<T> {
    return this.#compare;
  }

  constructor(compareFunction: ComparatorFunction<T> = defaultCompare) {
    this.#compare = compareFunction;
    this.equal = (a: T, b: T) => this.#compare(a, b) === 0;

    Object.defineProperty(this, "equal", {
      writable: false,
      enumerable: true,
      configurable: false,
    });
  }

  unequal(a: T, b: T): boolean {
    return this.#compare(a, b) !== 0;
  }

  lessThan(a: T, b: T): boolean {
    return this.#compare(a, b) === -1;
  }

  greaterThan(a: T, b: T): boolean {
    return this.#compare(a, b) === 1;
  }

  lessThanOrEqual(a: T, b: T): boolean {
    return this.#compare(a, b) !== 1;
  }

  greaterThanOrEqual(a: T, b: T): boolean {
    return this.#compare(a, b) !== -1;
  }

  resetCompare(compareFunction: ComparatorFunction<T>): void {
    this.#compare = compareFunction;
  }
}
