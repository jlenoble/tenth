import {
  createStore,
  applyMiddleware,
  combineReducers,
  Middleware,
  Store,
} from "redux";
import { createLogger } from "redux-logger";
import { SagaGenerator } from "../../../generics";
import {
  relationshipsForItemReducer as relationshipsForItem,
  currentPathReducer as currentPath,
} from "../redux-reducers";
import { sagaMiddleware, SagaManager } from "./saga-manager";
import * as Sagas from "../sagas";

type SagaMap = { [key: string]: () => SagaGenerator };

export class ReduxManager {
  public readonly store: Store;
  public readonly sagaManager: SagaManager;

  constructor({ log = false }: { log?: boolean }) {
    const middleWares: Middleware[] = [];

    if (log) {
      middleWares.push(createLogger({ collapsed: true }));
    }

    middleWares.push(sagaMiddleware);

    this.store = createStore(
      combineReducers({ relationshipsForItem, currentPath }),
      applyMiddleware(...middleWares)
    );
    this.sagaManager = new SagaManager();

    Object.keys(Sagas).forEach((sagaName: keyof SagaMap) => {
      this.sagaManager.add(sagaName as string, (Sagas as SagaMap)[sagaName]);
    });
  }
}
