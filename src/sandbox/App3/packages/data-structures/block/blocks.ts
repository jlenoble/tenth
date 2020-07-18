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

  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.keys();
  }

  *keys(): IterableIterator<T> {
    let lastItem: T | undefined;

    for (const block of this.#blocks) {
      for (const item of block) {
        if (item === lastItem) {
          continue;
        }
        lastItem = item;
        yield item;
      }
    }
  }

  *values(): IterableIterator<number> {
    let lastItem: T | undefined;
    let width = 0;

    for (const block of this.#blocks) {
      let blockWidth = 0;

      for (const [item, _width] of block.entries()) {
        if (!lastItem) {
          lastItem = item;
        }

        if (width > 0 && item !== lastItem) {
          yield width;
          width = 0;
          lastItem = item;
        }

        width += _width;
        blockWidth += _width;

        if (item === lastItem) {
          if (_width !== this.#blockWidth && blockWidth !== this.#blockWidth) {
            yield width;
            width = 0;
            lastItem = undefined;
          }
          continue;
        }
      }
    }
  }

  *entries(): IterableIterator<[T, number]> {
    let lastItem: T | undefined;
    let width = 0;

    for (const block of this.#blocks) {
      let blockWidth = 0;

      for (const [item, _width] of block.entries()) {
        if (!lastItem) {
          lastItem = item;
        }

        if (width > 0 && item !== lastItem) {
          yield [lastItem, width];
          width = 0;
          lastItem = item;
        }

        width += _width;
        blockWidth += _width;

        if (item === lastItem) {
          if (_width !== this.#blockWidth && blockWidth !== this.#blockWidth) {
            yield [item, width];
            width = 0;
            lastItem = undefined;
          }
          continue;
        }
      }
    }
  }

  *blocks(): IterableIterator<BlockInterface<T>> {
    yield* this.#blocks;
  }

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
    let firstIndex = -1;

    const deleted = this.#blocks.some((block, i) => {
      if (block.delete(item).deleted) {
        if (firstIndex === -1) {
          firstIndex = i;
        }
        return true;
      }
      return false;
    });

    if (deleted) {
      const blocks = this.#blocks.slice(0, firstIndex);
      const items: Map<T, number> = new Map();

      for (let i = firstIndex; i < this.#blocks.length; i++) {
        for (const [_item, width] of this.#blocks[i].entries()) {
          if (item === _item) {
            continue;
          }
          items.set(_item, width + (items.get(_item) || 0));
        }
      }

      let currentBlock = new Block<T>(this.#blockWidth);
      blocks.push(currentBlock);

      for (const [item, width] of items) {
        let { free } = currentBlock.add(item, width);

        while (free < 0) {
          currentBlock = new Block<T>(this.#blockWidth);
          blocks.push(currentBlock);
          free = currentBlock.add(item, -free).free;
        }
      }
      this.#blocks = blocks;
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
