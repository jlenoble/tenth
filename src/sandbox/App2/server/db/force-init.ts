import { createStore } from "./store";
import { DBInitManager } from "../../managers";
import { coreData } from "./core-data";

const store = createStore();

const manager = new DBInitManager({ store, coreData });

manager.resetTables();
