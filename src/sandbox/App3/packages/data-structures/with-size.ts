import { Node, Constructor, DataStructure } from "./types";

export const withSize = <T, N extends Node<T>>(
  Structure: Constructor<DataStructure<T, N>>
): Constructor<DataStructure<T, N>> => {
  class SizedStructure extends Structure {
    #size: number;

    get size(): number {
      return this.#size;
    }

    constructor() {
      super();
      this.#size = 0;
    }

    append(value: T): this {
      this.#size++;
      return super.append(value);
    }

    prepend(value: T): this {
      this.#size++;
      return super.prepend(value);
    }

    deleteHead(): N | null {
      if (this.size === 0) {
        return null;
      }
      this.#size--;
      return super.deleteHead();
    }

    deleteTail(): N | null {
      if (this.size === 0) {
        return null;
      }
      this.#size--;
      return super.deleteTail();
    }
  }

  Object.defineProperty(SizedStructure, "name", {
    value: "Sized" + Structure.name,
  });

  return SizedStructure;
};
