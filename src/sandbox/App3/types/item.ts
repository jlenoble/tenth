export interface ItemCtor<T extends Item> {
  nItems: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

export interface Item {
  id: number;

  destroy(): void;
}
