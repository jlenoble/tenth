export interface ItemCtor {
  nItems: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): Item;
}

export interface Item {
  id: number;

  destroy(): void;
}
