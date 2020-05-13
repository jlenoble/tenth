import { createStore, Store } from "./store";

const store = createStore();

(Object.keys(store) as (keyof Store)[]).forEach(
  async (tableName): Promise<void> => {
    await store[tableName].sync({ force: true });
    console.log(`Created or reset ${tableName}`);
  }
);
