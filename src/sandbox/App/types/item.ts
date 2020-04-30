import { Errors } from "./errors";

// From DB or Disc
export type PersistedItem<T> = Readonly<Omit<T, "itemId" | "errors">>;

// Passed around in app through actions
export type Payload<T> = Readonly<PersistedItem<T> & { errors?: Errors }>;

// What is stored by redux
export type ItemState<T> = Readonly<
  PersistedItem<T> & { itemId: string; errors?: Errors }
>;
