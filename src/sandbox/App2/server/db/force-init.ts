import { createStore } from "./store";
import { DBInitManager, dbCoreData } from "../../managers";

const store = createStore();

const manager = new DBInitManager({ store, dbCoreData });

manager.resetTables();
