import { Blocks as BlocksInterface, Block as BlockInterface } from "./types";
import { Block } from "./block";

export class Blocks<T> implements BlocksInterface<T> {
  #blockWidth: number;
  #blocks: BlockInterface<T>[];

  get width(): number {
    return this.#blocks.length * this.#blockWidth;
  }

  get occupied(): number {
    return this.width - this.free;
  }

  get free(): number {
    return this.#blocks[this.#blocks.length - 1].free;
  }

  get size(): number {
    let lastBlock: BlockInterface<T>;

    return this.#blocks.reduce((size, block) => {
      let nSeen = 0;

      if (lastBlock) {
        const currentItem: T = block[Symbol.iterator]().next().value;
        if (lastBlock.has(currentItem)) {
          nSeen = 1;
        }
      }

      lastBlock = block;
      return size + block.size - nSeen;
    }, 0);
  }

  // *[Symbol.iterator](): IterableIterator<T> {
  //   yield* this.#items.keys();
  // }

  constructor(blockWidth: number) {
    this.#blockWidth = blockWidth;
    this.#blocks = [new Block(blockWidth)];
  }

  isEmpty(): boolean {
    return this.#blocks[0].isEmpty();
  }

  isFull(): boolean {
    return this.#blocks[this.#blocks.length - 1].isFull();
  }

  add(item: T, width: number): { free: number; added: boolean } {
    let currentBlock = this.#blocks[this.#blocks.length - 1];

    if (currentBlock.isFull()) {
      currentBlock = new Block(this.#blockWidth);
      this.#blocks.push(currentBlock);
    }

    const { free, added } = currentBlock.add(item, width);

    if (!added) {
      return { free: this.free, added: false };
    } else if (free >= 0) {
      return { added: true, free };
    } else {
      return this.add(item, -free);
    }
  }

  delete(item: T): { free: number; deleted: boolean } {
    const indices: number[] = [];

    const deleted = this.#blocks.some((block, i) => {
      if (block.delete(item).deleted) {
        indices.push(i);
        return true;
      }
      return false;
    });

    if (indices.length > 0) {
      const index = indices.shift()!;
      const lastIndex = indices[indices.length - 1];

      for (let i = index; i <= lastIndex; i++) {
        const block = this.#blocks[i];
        if (block.isFull()) {
          continue;
        }
      }
    }

    return { free: this.free, deleted };
  }

  get(item: T): number | undefined {
    let width = 0;

    for (const block of this.#blocks) {
      if (block.has(item)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        width += block.get(item)!;
      }
    }

    return width;
  }

  has(item: T): boolean {
    return this.#blocks.some((block) => block.has(item));
  }

  clear(): void {
    this.#blocks.forEach((block) => block.clear());
    this.#blocks.length = 1;
  }
}
