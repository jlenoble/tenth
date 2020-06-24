export interface Item {
  id: number;
  valid: boolean;

  destroy(): void;
}
