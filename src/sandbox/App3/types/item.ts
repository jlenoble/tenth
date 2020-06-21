export interface ItemCtor {
  nItems: number;
}

export interface Item {
  id: number;

  destroy(): void;
}
